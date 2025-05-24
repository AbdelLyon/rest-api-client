import { describe, it, expect, vi, beforeEach } from "vitest";
import { Model } from "../builder/Model";

describe("Model", () => {
  let model: Model<unknown>;
  let mockMutationFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    model = new Model();
    mockMutationFn = vi.fn().mockResolvedValue({ success: true });
  });

  describe("setMutationFunction", () => {
    it("should set the mutation function", () => {
      expect(() => model.setMutationFunction(mockMutationFn)).not.toThrow();
    });
  });

  describe("create", () => {
    it("should create a create operation and return builder context", () => {
      const attributes = { name: "test", email: "test@example.com" };

      const result = model.create({ attributes });

      expect(result).toHaveProperty("build");
      expect(result).toHaveProperty("mutate");
      expect(result).toHaveProperty("relation");

      // Tester que la relation a les bonnes méthodes
      expect(result.relation).toHaveProperty("add");
      expect(result.relation).toHaveProperty("attach");
    });

    it("should handle relations in create operation", () => {
      const attributes = { name: "test" };
      const relations = { posts: [] };

      const result = model.create({ attributes, relations });

      expect(result).toHaveProperty("relation");
      expect(result.relation).toHaveProperty("add");
      expect(result.relation).toHaveProperty("attach");
    });
  });

  describe("update", () => {
    it("should create an update operation and return builder context", () => {
      const key = 1;
      const attributes = { name: "updated" };

      const result = model.update(key, { attributes });

      expect(result).toHaveProperty("build");
      expect(result).toHaveProperty("mutate");
      expect(result).toHaveProperty("relation");

      // Tester que la relation a toutes les méthodes en contexte update
      expect(result.relation).toHaveProperty("add");
      expect(result.relation).toHaveProperty("attach");
      expect(result.relation).toHaveProperty("edit");
      expect(result.relation).toHaveProperty("detach");
    });

    it("should handle empty attributes and relations", () => {
      const key = 1;

      const result = model.update(key, {});

      expect(result).toHaveProperty("build");
      expect(result.relation).toHaveProperty("edit");
    });

    it("should handle relations in update operation", () => {
      const key = 1;
      const attributes = { name: "updated" };
      const relations = { posts: [] };

      const result = model.update(key, { attributes, relations });

      expect(result).toHaveProperty("relation");
      expect(result.relation).toHaveProperty("edit");
      expect(result.relation).toHaveProperty("sync");
    });
  });

  describe("build", () => {
    it("should return operations and clear them", () => {
      const attributes = { name: "test" };

      const context1 = model.create({ attributes });
      const context2 = model.create({ attributes });

      const result = context1.build();

      expect(result).toHaveProperty("mutate");
      expect(result.mutate).toHaveLength(2);

      // Vérifier que les opérations sont vidées après build
      const secondResult = context2.build();
      expect(secondResult.mutate).toHaveLength(0);
    });
  });

  describe("mutate", () => {
    it("should call mutation function with built data", async () => {
      model.setMutationFunction(mockMutationFn);
      const attributes = { name: "test" };

      const context = model.create({ attributes });
      await context.mutate();

      expect(mockMutationFn).toHaveBeenCalledWith(
        {
          mutate: [
            expect.objectContaining({ operation: "create", attributes }),
          ],
        },
        undefined,
      );
    });

    it("should pass options to mutation function", async () => {
      model.setMutationFunction(mockMutationFn);
      const attributes = { name: "test" };
      const options = { timeout: 5000 };

      const context = model.create({ attributes });
      await context.mutate(options);

      expect(mockMutationFn).toHaveBeenCalledWith(expect.any(Object), options);
    });

    it("should throw error if mutation function not provided", async () => {
      const attributes = { name: "test" };

      const context = model.create({ attributes });

      await expect(context.mutate()).rejects.toThrow(
        "Mutation function not provided to builder",
      );
    });
  });
});

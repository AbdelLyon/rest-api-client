// tests/builder/Builder.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Builder } from "../builder/Builder";

describe("Builder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRelation", () => {
    it("should return a Relation instance", () => {
      const result = Builder.getRelation();

      expect(result).toBeDefined();
      expect(result).toHaveProperty("add");
      expect(result).toHaveProperty("attach");
      expect(result).toHaveProperty("edit");
      expect(result).toHaveProperty("setContext");
    });
  });

  describe("create", () => {
    it("should create and return a new Model instance", () => {
      const result = Builder.create<unknown>();

      expect(result).toBeDefined();
      expect(result).toHaveProperty("create");
      expect(result).toHaveProperty("update");
      expect(result).toHaveProperty("setMutationFunction");
    });

    it("should work with generic types", () => {
      interface TestType {
        id: number;
        name: string;
      }

      const result = Builder.create<TestType>();

      expect(result).toBeDefined();
      expect(result).toHaveProperty("create");
      expect(result).toHaveProperty("update");
    });
  });
});

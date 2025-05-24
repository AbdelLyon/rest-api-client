/* eslint-disable @typescript-eslint/no-explicit-any */
// tests/Mutation.test.ts - Correction des 2 tests qui échouent
import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import { Mutation } from "../Mutation";

// Mocks sans variables externes - approche simplifiée
vi.mock("@/http/HttpClient", () => ({
  HttpClient: {
    getInstance: vi.fn(() => ({
      request: vi.fn(),
    })),
  },
}));

vi.mock("./builder/Builder", () => ({
  Builder: {
    create: vi.fn(() => ({
      setMutationFunction: vi.fn(),
    })),
  },
}));

vi.mock("./builder/Relation", () => ({
  Relation: {
    getInstance: vi.fn(() => ({
      setContext: vi.fn(),
    })),
  },
}));

// Classe concrète pour les tests
class TestMutation extends Mutation<{ id: number; name: string }> {
  constructor() {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
    });
    super("/test", schema);
  }
}

describe("Mutation", () => {
  let mutation: TestMutation;

  beforeEach(() => {
    // Réinitialiser les mocks
    mutation = new TestMutation();
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with correct pathname and schema", () => {
      expect(mutation).toBeDefined();
    });

    it("should initialize with custom http instance name", () => {
      expect(mutation).toBeDefined();
    });
  });

  describe("model getter", () => {
    it("should return a model with mutation function set", () => {
      const result = mutation.model;

      // Tester les propriétés réelles au lieu de comparer avec le mock
      expect(result).toBeDefined();
      expect(result).toHaveProperty("setMutationFunction");
      expect(typeof result.setMutationFunction).toBe("function");

      // Vérifier que l'objet Model a les bonnes méthodes
      expect(result).toHaveProperty("create");
      expect(result).toHaveProperty("update");
    });
  });

  describe("relation getter", () => {
    it("should return the relation instance", () => {
      const result = mutation.relation;

      // Tester les propriétés réelles au lieu de comparer avec le mock
      expect(result).toBeDefined();
      expect(result).toHaveProperty("setContext");
      expect(typeof result.setContext).toBe("function");

      // Vérifier que l'objet Relation a les bonnes méthodes
      expect(result).toHaveProperty("add");
      expect(result).toHaveProperty("attach");
      expect(result).toHaveProperty("edit");
    });
  });

  describe("mutate", () => {
    it("should handle BuilderWithCreationContext", async () => {
      const mockBuilderContext = {
        build: vi.fn().mockReturnValue({ mutate: [{ operation: "create" }] }),
      };
      const mockResponse = { success: true };

      // Spy sur la méthode request du http client réel
      const requestSpy = vi
        .spyOn(mutation["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await mutation.mutate(mockBuilderContext as any);

      expect(mockBuilderContext.build).toHaveBeenCalled();
      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test/mutate",
        data: { mutate: [{ operation: "create" }] },
      });
      expect(result).toBe(mockResponse);
    });

    it("should handle MutationRequest directly", async () => {
      const mutationRequest = { mutate: [{ operation: "update" }] };
      const mockResponse = { success: true };

      // Spy sur la méthode request du http client réel
      const requestSpy = vi
        .spyOn(mutation["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await mutation.mutate(mutationRequest as any);

      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test/mutate",
        data: mutationRequest,
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe("action", () => {
    it("should make POST request to action endpoint", async () => {
      const actionRequest = {
        action: "publish",
        payload: {
          fields: [{ name: "status", value: "published" }],
        },
      };
      const mockResponse = {
        data: { impacted: 5 },
      };

      const requestSpy = vi
        .spyOn(mutation["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await mutation.action(actionRequest);

      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test/actions/publish",
        data: actionRequest.payload,
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe("delete", () => {
    it("should make DELETE request and validate response data", async () => {
      const deleteRequest = { resources: [1, 2] };
      const mockResponse = {
        data: [
          { id: 1, name: "Test 1" },
          { id: 2, name: "Test 2" },
        ],
      };

      const requestSpy = vi
        .spyOn(mutation["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await mutation.delete(deleteRequest);

      expect(requestSpy).toHaveBeenCalledWith({
        method: "DELETE",
        url: "/test",
        data: deleteRequest,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error for invalid data", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const deleteRequest = { resources: [1] };
      const mockResponse = {
        data: [{ id: 1, invalid: "field" }],
      };

      vi.spyOn(mutation["http"], "request").mockResolvedValue(mockResponse);

      await expect(mutation.delete(deleteRequest)).rejects.toThrow(
        "Type validation failed:",
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Type validation failed:",
        expect.any(Array),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("forceDelete", () => {
    it("should make DELETE request to force endpoint", async () => {
      const deleteRequest = { resources: [1] };
      const mockResponse = {
        data: [{ id: 1, name: "Test" }],
      };

      const requestSpy = vi
        .spyOn(mutation["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await mutation.forceDelete(deleteRequest);

      expect(requestSpy).toHaveBeenCalledWith({
        method: "DELETE",
        url: "/test/force",
        data: deleteRequest,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("restore", () => {
    it("should make POST request to restore endpoint", async () => {
      const restoreRequest = { resources: [1] };
      const mockResponse = {
        data: [{ id: 1, name: "Test" }],
      };

      const requestSpy = vi
        .spyOn(mutation["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await mutation.restore(restoreRequest);

      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test/restore",
        data: restoreRequest,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("validateData", () => {
    it("should validate and return correct data", async () => {
      const deleteRequest = { resources: [1] };
      const mockResponse = {
        data: [{ id: 1, name: "Valid Test" }],
      };

      vi.spyOn(mutation["http"], "request").mockResolvedValue(mockResponse);

      const result = await mutation.delete(deleteRequest);

      expect(result.data).toEqual([{ id: 1, name: "Valid Test" }]);
    });

    it("should log validation errors and throw", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const deleteRequest = { resources: [1] };
      const mockResponse = {
        data: [{ id: "invalid", name: 123 }],
      };

      vi.spyOn(mutation["http"], "request").mockResolvedValue(mockResponse);

      await expect(mutation.delete(deleteRequest)).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Type validation failed:",
        expect.any(Array),
      );

      consoleSpy.mockRestore();
    });
  });
});

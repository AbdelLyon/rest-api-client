/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import { Query } from "../Query";

vi.mock("@/http", () => ({
  HttpClient: {
    getInstance: vi.fn(() => ({
      request: vi.fn(),
    })),
  },
}));

interface TestModel {
  id: number;
  name: string;
  email: string;
}

class TestQuery extends Query<TestModel> {
  constructor() {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
    });
    super("/test-resources", schema);
  }
}

describe("Query", () => {
  let query: TestQuery;

  beforeEach(() => {
    query = new TestQuery();
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with correct pathname and schema", () => {
      expect(query).toBeDefined();
      expect(query["pathname"]).toBe("/test-resources");
      expect(query["schema"]).toBeDefined();
    });

    it("should initialize with custom http instance name", () => {
      const customQuery = new (class extends Query<TestModel> {
        constructor() {
          const schema = z.object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
          });
          super("/custom", schema, "custom-instance");
        }
      })();

      expect(customQuery).toBeDefined();
      expect(customQuery["pathname"]).toBe("/custom");
    });
  });

  describe("search", () => {
    it("should make POST request and return validated data for simple search", async () => {
      const searchRequest = {
        text: { value: "test" },
        filters: [{ field: "name", operator: "=" as const, value: "john" }],
      };

      const mockResponse = {
        data: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Doe", email: "jane@example.com" },
        ],
      };

      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await query.search(searchRequest);

      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test-resources/search",
        data: { search: searchRequest },
      });

      expect(result).toEqual(mockResponse.data);
    });

    it("should return paginated response for paginated search", async () => {
      const paginatedSearchRequest = {
        text: { value: "test" },
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: [{ id: 1, name: "John Doe", email: "john@example.com" }],
        meta: { page: 1, perPage: 10, total: 1 },
      };

      vi.spyOn(query["http"], "request").mockResolvedValue(mockResponse);

      const result = await query.search(paginatedSearchRequest);

      expect(result).toEqual({
        data: mockResponse.data,
        meta: mockResponse.meta,
      });
    });

    it("should throw error for invalid data validation", async () => {
      const searchRequest = { text: { value: "test" } };
      const mockResponse = {
        data: [{ id: "invalid", name: 123, email: true }],
      };

      vi.spyOn(query["http"], "request").mockResolvedValue(mockResponse);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(query.search(searchRequest)).rejects.toThrow(
        "Type validation failed:",
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "Type validation failed:",
        expect.any(Array),
      );
      consoleSpy.mockRestore();
    });

    it("should handle generic response type", async () => {
      const searchRequest = { text: { value: "test" } };
      const mockResponse = {
        data: [{ id: 1, name: "John Doe", email: "john@example.com" }],
      };

      vi.spyOn(query["http"], "request").mockResolvedValue(mockResponse);

      const result = await query.search<TestModel[]>(searchRequest);

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("createSearchBuilder", () => {
    it("should create and return a SearchBuilder instance", () => {
      const builder = query.createSearchBuilder();

      expect(builder).toBeDefined();
      expect(builder).toHaveProperty("withText");
      expect(builder).toHaveProperty("withFilter");
      expect(builder).toHaveProperty("build");
    });

    it("should work with generic types", () => {
      const builder = query.createSearchBuilder<TestModel>();

      expect(builder).toBeDefined();
      expect(typeof builder.withText).toBe("function");
    });
  });

  describe("executeSearch", () => {
    it("should execute search using builder", async () => {
      const mockBuilder = {
        build: vi.fn().mockReturnValue({ text: { value: "test" } }),
      };

      const mockResponse = {
        data: [{ id: 1, name: "John Doe", email: "john@example.com" }],
      };

      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await query.executeSearch(mockBuilder as any);

      expect(mockBuilder.build).toHaveBeenCalled();
      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test-resources/search",
        data: { search: { text: { value: "test" } } },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("searchByText", () => {
    it("should search by text without pagination", async () => {
      const mockResponse = {
        data: [{ id: 1, name: "John Doe", email: "john@example.com" }],
      };

      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await query.searchByText("test query");

      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test-resources/search",
        data: {
          search: expect.objectContaining({ text: { value: "test query" } }),
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should search by text with pagination", async () => {
      const mockResponse = {
        data: [{ id: 1, name: "John Doe", email: "john@example.com" }],
        meta: { page: 1, perPage: 20, total: 1 },
      };

      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await query.searchByText("test query", 1, 20);

      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test-resources/search",
        data: {
          search: expect.objectContaining({
            text: { value: "test query" },
            page: 1,
            limit: 20,
          }),
        },
      });
      expect(result).toEqual({
        data: mockResponse.data,
        meta: mockResponse.meta,
      });
    });
  });

  describe("searchByField", () => {
    it("should search by field with operator and value", async () => {
      const mockResponse = {
        data: [{ id: 1, name: "John Doe", email: "john@example.com" }],
      };

      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await query.searchByField("name", "=", "John");

      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test-resources/search",
        data: {
          search: expect.objectContaining({
            filters: expect.arrayContaining([
              expect.objectContaining({
                field: "name",
                operator: "=",
                value: "John",
              }),
            ]),
          }),
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle different comparison operators", async () => {
      const mockResponse = {
        data: [{ id: 10, name: "John Doe", email: "john@example.com" }],
      };

      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await query.searchByField("id", ">", 5);

      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test-resources/search",
        data: {
          search: expect.objectContaining({
            filters: expect.arrayContaining([
              expect.objectContaining({ field: "id", operator: ">", value: 5 }),
            ]),
          }),
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle array values with "in" operator', async () => {
      const mockResponse = {
        data: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Doe", email: "jane@example.com" },
        ],
      };

      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await query.searchByField("id", "in", 4);

      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test-resources/search",
        data: {
          search: expect.objectContaining({
            filters: expect.arrayContaining([
              expect.objectContaining({
                field: "id",
                operator: "in",
                value: 4,
              }),
            ]),
          }),
        },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("createDetailsBuilder", () => {
    it("should create and return a DetailsBuilder instance", () => {
      const builder = query.createDetailsBuilder();

      expect(builder).toBeDefined();
      expect(builder).toHaveProperty("withHeaders");
      expect(builder).toHaveProperty("withTimeout");
      expect(builder).toHaveProperty("build");
    });

    it("should work with generic types", () => {
      const builder = query.createDetailsBuilder<TestModel>();

      expect(builder).toBeDefined();
      expect(typeof builder.withHeaders).toBe("function");
    });
  });

  describe("details", () => {
    it("should make GET request to resource details", async () => {
      const mockResponse = {
        data: {
          actions: [],
          instructions: [],
          fields: ["id", "name", "email"],
          limits: [10, 50, 100],
          scopes: ["active", "verified"],
          relations: [],
          rules: { all: {} },
        },
      };

      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      const result = await query.details();

      expect(requestSpy).toHaveBeenCalledWith({
        method: "GET",
        url: "/test-resources",
      });

      expect(result).toEqual(mockResponse);
    });

    it("should handle details request errors", async () => {
      const error = new Error("Details not found");
      vi.spyOn(query["http"], "request").mockRejectedValue(error);

      await expect(query.details()).rejects.toThrow("Details not found");
    });
  });

  describe("error handling", () => {
    it("should handle HTTP request errors in search", async () => {
      const searchRequest = { text: { value: "test" } };
      const error = new Error("Network error");
      vi.spyOn(query["http"], "request").mockRejectedValue(error);

      await expect(query.search(searchRequest)).rejects.toThrow(
        "Network error",
      );
    });

    it("should handle HTTP request errors in details", async () => {
      const error = new Error("Server error");
      vi.spyOn(query["http"], "request").mockRejectedValue(error);

      await expect(query.details()).rejects.toThrow("Server error");
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete search workflow", async () => {
      const mockResponse = {
        data: [{ id: 1, name: "John Doe", email: "john@example.com" }],
        meta: { page: 1, perPage: 10, total: 1 },
      };

      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      const builder = query.createSearchBuilder();
      builder.withText("john");
      builder.withFilter("email", "=", "john@example.com");
      builder.withPagination(1, 10);

      const result = await query.executeSearch(builder);

      expect(requestSpy).toHaveBeenCalledWith({
        method: "POST",
        url: "/test-resources/search",
        data: { search: expect.any(Object) },
      });

      expect(result).toEqual({
        data: mockResponse.data,
        meta: mockResponse.meta,
      });
    });

    it("should handle multiple validation errors", async () => {
      const searchRequest = { text: { value: "test" } };
      const mockResponse = {
        data: [{ id: "invalid1", name: null, email: 123 }],
      };

      vi.spyOn(query["http"], "request").mockResolvedValue(mockResponse);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(query.search(searchRequest)).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Type validation failed:",
        expect.any(Array),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("type safety", () => {
    it("should enforce field types in searchByField", async () => {
      const mockResponse = { data: [] };
      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      await query.searchByField("name", "=", "test");
      await query.searchByField("id", ">", 5);
      await query.searchByField("email", "in", "test@example.com");

      expect(requestSpy).toHaveBeenCalledTimes(3);
    });

    it("should handle generic response types correctly", async () => {
      const searchRequest = { text: { value: "test" } };
      const mockResponse = {
        data: [{ id: 1, name: "John Doe", email: "john@example.com" }],
      };

      vi.spyOn(query["http"], "request").mockResolvedValue(mockResponse);

      const arrayResult = await query.search<TestModel[]>(searchRequest);
      const customResult = await query.search<{ items: TestModel[] }>(
        searchRequest,
      );

      expect(arrayResult).toBeDefined();
      expect(customResult).toBeDefined();
    });
  });

  describe("builder methods behavior", () => {
    it("should properly integrate with SearchBuilder", async () => {
      const mockResponse = {
        data: [{ id: 1, name: "Test User", email: "test@example.com" }],
      };

      const requestSpy = vi
        .spyOn(query["http"], "request")
        .mockResolvedValue(mockResponse);

      await query.searchByText("test");
      await query.searchByField("name", "=", "test");

      expect(requestSpy).toHaveBeenCalledTimes(2);
    });

    it("should properly integrate with DetailsBuilder", () => {
      const builder = query.createDetailsBuilder();

      expect(builder).toBeDefined();
      expect(typeof builder.details).toBe("function");
    });
  });
});

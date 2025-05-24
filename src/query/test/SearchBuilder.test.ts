import { describe, it, expect, vi, beforeEach } from "vitest";
import type { RequestConfig } from "@/http";
import type {
  IQuery,
  PaginatedSearchRequest,
  FilterCriteria,
  Filter,
  InstructionField,
  SearchPermission,
  AggregationFunction,
  ComparisonOperator,
  SortDirection,
} from "../types";
import { SearchBuilder } from "../SearchBuilder";

interface TestUser {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
  posts: Array<{ id: number; title: string; content: string }>;
  profile: { bio: string; avatar: string };
  tags: Array<string>;
}

const createMockQuery = (): IQuery<TestUser> => ({
  search: vi
    .fn()
    .mockResolvedValue([
      { id: 1, name: "John", email: "john@example.com", age: 30, active: true },
    ]),
  details: vi.fn(),
});

const createTestBuilder = () => {
  const mockQuery = createMockQuery();
  const builder = new SearchBuilder<TestUser>();
  builder.setQueryInstance(mockQuery);
  return { mockQuery, builder };
};

describe("SearchBuilder", () => {
  let mockQuery: IQuery<TestUser>;
  let builder: SearchBuilder<TestUser>;

  beforeEach(() => {
    ({ mockQuery, builder } = createTestBuilder());
  });

  describe("constructor", () => {
    it("should create instance", () => {
      expect(builder).toBeInstanceOf(SearchBuilder);
      expect(builder.build()).toEqual({});
    });
  });

  describe("withText", () => {
    it("should set text search", () => {
      const result = builder.withText("search term");

      expect(result).toBe(builder);
      expect(builder.build()).toEqual({
        text: { value: "search term" },
      });
    });

    it("should override existing text search", () => {
      builder.withText("first").withText("second");

      expect(builder.build()).toEqual({
        text: { value: "second" },
      });
    });

    it("should handle empty string", () => {
      builder.withText("");

      expect(builder.build()).toEqual({
        text: { value: "" },
      });
    });
  });

  describe("withScope", () => {
    it("should add scope without parameters", () => {
      const result = builder.withScope("active");

      expect(result).toBe(builder);
      expect(builder.build()).toEqual({
        scopes: [{ name: "active", parameters: [] }],
      });
    });

    it("should add scope with parameters", () => {
      builder.withScope("status", ["published", "draft"]);

      expect(builder.build()).toEqual({
        scopes: [{ name: "status", parameters: ["published", "draft"] }],
      });
    });

    it("should add multiple scopes", () => {
      builder
        .withScope("active")
        .withScope("verified", [true])
        .withScope("role", ["admin", "user"]);

      expect(builder.build()).toEqual({
        scopes: [
          { name: "active", parameters: [] },
          { name: "verified", parameters: [true] },
          { name: "role", parameters: ["admin", "user"] },
        ],
      });
    });

    it("should handle different parameter types", () => {
      builder.withScope("mixed", ["string", 42, true, false]);

      expect(builder.build()).toEqual({
        scopes: [{ name: "mixed", parameters: ["string", 42, true, false] }],
      });
    });
  });

  describe("withFilter", () => {
    it("should add basic filter", () => {
      const result = builder.withFilter("name", "=", "John");

      expect(result).toBe(builder);
      expect(builder.build()).toEqual({
        filters: [{ field: "name", operator: "=", value: "John" }],
      });
    });

    it("should add filter with logical operator", () => {
      builder.withFilter("age", ">", 18, "and");

      expect(builder.build()).toEqual({
        filters: [{ field: "age", operator: ">", value: 18, type: "and" }],
      });
    });

    it("should add multiple filters", () => {
      builder
        .withFilter("name", "=", "John")
        .withFilter("age", ">", 18, "and")
        .withFilter("active", "=", true, "or");

      expect(builder.build()).toEqual({
        filters: [
          { field: "name", operator: "=", value: "John" },
          { field: "age", operator: ">", value: 18, type: "and" },
          { field: "active", operator: "=", value: true, type: "or" },
        ],
      });
    });

    it("should handle different operators", () => {
      const operators: ComparisonOperator[] = ["=", ">", "<", "in"];

      operators.forEach((operator) => {
        const newBuilder = new SearchBuilder<TestUser>();
        newBuilder.withFilter("age", operator, 25);

        expect(newBuilder.build()).toEqual({
          filters: [{ field: "age", operator, value: 25 }],
        });
      });
    });
  });

  describe("withNestedFilters", () => {
    it("should add nested filters", () => {
      const nestedFilters: FilterCriteria[] = [
        { field: "name", operator: "=", value: "John" },
        { field: "age", operator: ">", value: 18, type: "and" },
      ];

      const result = builder.withNestedFilters(nestedFilters);

      expect(result).toBe(builder);
      expect(builder.build()).toEqual({
        filters: [{ nested: nestedFilters }],
      });
    });

    it("should combine with regular filters", () => {
      const nestedFilters: FilterCriteria[] = [
        { field: "name", operator: "=", value: "John" },
      ];

      builder.withFilter("active", "=", true).withNestedFilters(nestedFilters);

      expect(builder.build()).toEqual({
        filters: [
          { field: "active", operator: "=", value: true },
          { nested: nestedFilters },
        ],
      });
    });

    it("should handle empty nested filters", () => {
      builder.withNestedFilters([]);

      expect(builder.build()).toEqual({
        filters: [{ nested: [] }],
      });
    });
  });

  describe("withSort", () => {
    it("should add sort with default direction", () => {
      const result = builder.withSort("name");

      expect(result).toBe(builder);
      expect(builder.build()).toEqual({
        sorts: [{ field: "name", direction: "asc" }],
      });
    });

    it("should add sort with specified direction", () => {
      builder.withSort("age", "desc");

      expect(builder.build()).toEqual({
        sorts: [{ field: "age", direction: "desc" }],
      });
    });

    it("should add multiple sorts", () => {
      builder.withSort("name", "asc").withSort("age", "desc").withSort("email");

      expect(builder.build()).toEqual({
        sorts: [
          { field: "name", direction: "asc" },
          { field: "age", direction: "desc" },
          { field: "email", direction: "asc" },
        ],
      });
    });

    it("should handle different sort directions", () => {
      const directions: SortDirection[] = ["asc", "desc"];

      directions.forEach((direction) => {
        const newBuilder = new SearchBuilder<TestUser>();
        newBuilder.withSort("name", direction);

        expect(newBuilder.build()).toEqual({
          sorts: [{ field: "name", direction }],
        });
      });
    });
  });

  describe("withSelect", () => {
    it("should add field selection", () => {
      const result = builder.withSelect("name");

      expect(result).toBe(builder);
      expect(builder.build()).toEqual({
        selects: [{ field: "name" }],
      });
    });

    it("should add multiple field selections", () => {
      builder.withSelect("name").withSelect("email").withSelect("age");

      expect(builder.build()).toEqual({
        selects: [{ field: "name" }, { field: "email" }, { field: "age" }],
      });
    });
  });

  describe("withInclude", () => {
    it("should add basic include", () => {
      const result = builder.withInclude("posts");

      expect(result).toBe(builder);
      expect(builder.build()).toEqual({
        includes: [{ relation: "posts" }],
      });
    });

    it("should add include with options", () => {
      const options = {
        filters: [
          {
            field: "published",
            operator: "=" as ComparisonOperator,
            value: true,
          },
        ],
        sorts: [{ field: "created_at", direction: "desc" as SortDirection }],
        selects: [{ field: "title" }],
        limit: 10,
      };

      builder.withInclude("posts", options);

      expect(builder.build()).toEqual({
        includes: [{ relation: "posts", ...options }],
      });
    });

    it("should add multiple includes", () => {
      builder.withInclude("posts").withInclude("profile", { limit: 1 });

      expect(builder.build()).toEqual({
        includes: [{ relation: "posts" }, { relation: "profile", limit: 1 }],
      });
    });

    it("should handle include with scopes", () => {
      builder.withInclude("posts", {
        scopes: [
          { name: "published", parameters: [] },
          { name: "recent", parameters: [30] },
        ],
      });

      expect(builder.build()).toEqual({
        includes: [
          {
            relation: "posts",
            scopes: [
              { name: "published", parameters: [] },
              { name: "recent", parameters: [30] },
            ],
          },
        ],
      });
    });
  });

  describe("withAggregate", () => {
    it("should add basic aggregate", () => {
      const result = builder.withAggregate("posts", "count");

      expect(result).toBe(builder);
      expect(builder.build()).toEqual({
        aggregates: [{ relation: "posts", type: "count" }],
      });
    });

    it("should add aggregate with field", () => {
      builder.withAggregate("posts", "avg", "rating");

      expect(builder.build()).toEqual({
        aggregates: [{ relation: "posts", type: "avg", field: "rating" }],
      });
    });

    it("should add aggregate with filters", () => {
      const filters: Filter[] = [
        { field: "published", operator: "=", value: true },
      ];

      builder.withAggregate("posts", "sum", "views", filters);

      expect(builder.build()).toEqual({
        aggregates: [
          {
            relation: "posts",
            type: "sum",
            field: "views",
            filters,
          },
        ],
      });
    });

    it("should add multiple aggregates", () => {
      builder
        .withAggregate("posts", "count")
        .withAggregate("posts", "avg", "rating")
        .withAggregate("posts", "max", "views");

      expect(builder.build()).toEqual({
        aggregates: [
          { relation: "posts", type: "count" },
          { relation: "posts", type: "avg", field: "rating" },
          { relation: "posts", type: "max", field: "views" },
        ],
      });
    });

    it("should handle different aggregation functions", () => {
      const functions: AggregationFunction[] = [
        "min",
        "max",
        "avg",
        "sum",
        "count",
        "exists",
      ];

      functions.forEach((func) => {
        const newBuilder = new SearchBuilder<TestUser>();
        newBuilder.withAggregate("posts", func);

        expect(newBuilder.build()).toEqual({
          aggregates: [{ relation: "posts", type: func }],
        });
      });
    });
  });

  describe("withInstruction", () => {
    it("should add instruction", () => {
      const fields: InstructionField[] = [
        { name: "action", value: "update" },
        { name: "batch_size", value: 100 },
      ];

      const result = builder.withInstruction("batch_update", fields);

      expect(result).toBe(builder);
      expect(builder.build()).toEqual({
        instructions: [{ name: "batch_update", fields }],
      });
    });

    it("should add multiple instructions", () => {
      builder
        .withInstruction("validate", [{ name: "strict", value: true }])
        .withInstruction("transform", [{ name: "format", value: "json" }]);

      expect(builder.build()).toEqual({
        instructions: [
          { name: "validate", fields: [{ name: "strict", value: true }] },
          { name: "transform", fields: [{ name: "format", value: "json" }] },
        ],
      });
    });

    it("should handle empty instruction fields", () => {
      builder.withInstruction("empty_instruction", []);

      expect(builder.build()).toEqual({
        instructions: [{ name: "empty_instruction", fields: [] }],
      });
    });
  });

  describe("withGate", () => {
    it("should add gate permission", () => {
      const result = builder.withGate("view");

      expect(result).toBe(builder);
      expect(builder.build()).toEqual({
        Gates: ["view"],
      });
    });

    it("should add multiple gate permissions", () => {
      builder.withGate("view").withGate("create").withGate("update");

      expect(builder.build()).toEqual({
        Gates: ["view", "create", "update"],
      });
    });

    it("should handle all permission types", () => {
      const permissions: SearchPermission[] = [
        "create",
        "view",
        "update",
        "delete",
        "restore",
        "forceDelete",
      ];

      permissions.forEach((permission) => {
        const newBuilder = new SearchBuilder<TestUser>();
        newBuilder.withGate(permission);

        expect(newBuilder.build()).toEqual({
          Gates: [permission],
        });
      });
    });
  });

  describe("withPagination", () => {
    it("should add pagination", () => {
      const result = builder.withPagination(2, 20);

      expect(result).toBe(builder);
      const request = builder.build() as PaginatedSearchRequest;
      expect(request.page).toBe(2);
      expect(request.limit).toBe(20);
    });

    it("should override existing pagination", () => {
      builder.withPagination(1, 10).withPagination(3, 50);

      const request = builder.build() as PaginatedSearchRequest;
      expect(request.page).toBe(3);
      expect(request.limit).toBe(50);
    });

    it("should handle zero values", () => {
      builder.withPagination(0, 0);

      const request = builder.build() as PaginatedSearchRequest;
      expect(request.page).toBe(0);
      expect(request.limit).toBe(0);
    });
  });

  describe("build", () => {
    it("should return empty request when no options set", () => {
      const request = builder.build();
      expect(request).toEqual({});
    });

    it("should return complete search request", () => {
      const request = builder
        .withText("search term")
        .withScope("active")
        .withFilter("name", "=", "John")
        .withSort("age", "desc")
        .withSelect("email")
        .withInclude("posts")
        .withAggregate("posts", "count")
        .withInstruction("validate", [{ name: "strict", value: true }])
        .withGate("view")
        .withPagination(1, 10)
        .build() as PaginatedSearchRequest;

      expect(request).toEqual({
        text: { value: "search term" },
        scopes: [{ name: "active", parameters: [] }],
        filters: [{ field: "name", operator: "=", value: "John" }],
        sorts: [{ field: "age", direction: "desc" }],
        selects: [{ field: "email" }],
        includes: [{ relation: "posts" }],
        aggregates: [{ relation: "posts", type: "count" }],
        instructions: [
          { name: "validate", fields: [{ name: "strict", value: true }] },
        ],
        Gates: ["view"],
        page: 1,
        limit: 10,
      });
    });
  });

  describe("search", () => {
    it("should execute search with default options", async () => {
      const expectedResult = [{ id: 1, name: "John" }];
      vi.mocked(mockQuery.search).mockResolvedValue(expectedResult);

      builder.withText("search term");
      const result = await builder.search();

      expect(mockQuery.search).toHaveBeenCalledWith(
        { text: { value: "search term" } },
        {},
      );
      expect(result).toEqual(expectedResult);
    });

    it("should execute search with custom options", async () => {
      const expectedResult = [{ id: 1, name: "John" }];
      const options: Partial<RequestConfig> = {
        timeout: 5000,
        headers: { Authorization: "Bearer token" },
      };

      vi.mocked(mockQuery.search).mockResolvedValue(expectedResult);

      builder.withFilter("active", "=", true);
      const result = await builder.search(options);

      expect(mockQuery.search).toHaveBeenCalledWith(
        { filters: [{ field: "active", operator: "=", value: true }] },
        options,
      );
      expect(result).toEqual(expectedResult);
    });

    it("should execute search with typed response", async () => {
      interface CustomResponse {
        data: TestUser[];
        meta: { total: number };
      }

      const expectedResult: CustomResponse = {
        data: [
          {
            id: 1,
            name: "John",
            email: "john@example.com",
            age: 30,
            active: true,
          } as TestUser,
        ],
        meta: { total: 1 },
      };

      vi.mocked(mockQuery.search).mockResolvedValue(expectedResult);

      const result = await builder.search<CustomResponse>();

      expect(result).toEqual(expectedResult);
    });

    it("should throw error when no query instance provided", async () => {
      const builderWithoutQuery = new SearchBuilder<TestUser>();

      await expect(builderWithoutQuery.search()).rejects.toThrow(
        "No query instance provided to execute the search",
      );
    });

    it("should handle search errors", async () => {
      const error = new Error("Search failed");
      vi.mocked(mockQuery.search).mockRejectedValue(error);

      await expect(builder.search()).rejects.toThrow("Search failed");
    });
  });

  describe("method chaining", () => {
    it("should support full method chaining", () => {
      const result = builder
        .withText("search")
        .withScope("active")
        .withFilter("name", "=", "John")
        .withSort("age", "desc")
        .withSelect("email")
        .withInclude("posts")
        .withAggregate("posts", "count")
        .withInstruction("validate", [])
        .withGate("view")
        .withPagination(1, 10);

      expect(result).toBe(builder);

      const request = builder.build() as PaginatedSearchRequest;
      expect(request.text?.value).toBe("search");
      expect(request.scopes).toHaveLength(1);
      expect(request.filters).toHaveLength(1);
      expect(request.sorts).toHaveLength(1);
      expect(request.selects).toHaveLength(1);
      expect(request.includes).toHaveLength(1);
      expect(request.aggregates).toHaveLength(1);
      expect(request.instructions).toHaveLength(1);
      expect(request.Gates).toHaveLength(1);
      expect(request.page).toBe(1);
      expect(request.limit).toBe(10);
    });

    it("should allow building and searching in chain", async () => {
      const expectedResult = [{ id: 1, name: "John" }];
      vi.mocked(mockQuery.search).mockResolvedValue(expectedResult);

      const result = await builder
        .withText("search")
        .withFilter("active", "=", true)
        .search({ timeout: 3000 });

      expect(result).toEqual(expectedResult);
      expect(mockQuery.search).toHaveBeenCalledWith(
        {
          text: { value: "search" },
          filters: [{ field: "active", operator: "=", value: true }],
        },
        { timeout: 3000 },
      );
    });
  });

  describe("type safety", () => {
    it("should enforce field types in filters", () => {
      builder.withFilter("name", "=", "John");
      builder.withFilter("age", ">", 18);
      builder.withFilter("active", "=", true);
    });

    it("should enforce field types in sorts and selects", () => {
      builder.withSort("name", "asc");
      builder.withSort("age", "desc");
      builder.withSelect("email");
      builder.withSelect("id");
    });

    it("should enforce relation types in includes and aggregates", () => {
      builder.withInclude("posts");
      builder.withInclude("profile");
      builder.withAggregate("posts", "count");
    });
  });

  describe("edge cases", () => {
    it("should handle complex nested scenarios", () => {
      const complexFilters: FilterCriteria[] = [
        { field: "name", operator: "=", value: "John", type: "and" },
        { field: "age", operator: ">", value: 18, type: "or" },
      ];

      builder
        .withText("complex search")
        .withScope("verified", [true])
        .withFilter("active", "=", true)
        .withNestedFilters(complexFilters)
        .withSort("age", "desc")
        .withSelect("name")
        .withSelect("email")
        .withInclude("posts", {
          filters: [{ field: "published", operator: "=", value: true }],
          limit: 5,
        })
        .withAggregate("posts", "count")
        .withInstruction("cache", [{ name: "duration", value: 3600 }])
        .withGate("view")
        .withGate("update")
        .withPagination(2, 25);

      const request = builder.build() as PaginatedSearchRequest;

      expect(request).toEqual({
        text: { value: "complex search" },
        scopes: [{ name: "verified", parameters: [true] }],
        filters: [
          { field: "active", operator: "=", value: true },
          { nested: complexFilters },
        ],
        sorts: [{ field: "age", direction: "desc" }],
        selects: [{ field: "name" }, { field: "email" }],
        includes: [
          {
            relation: "posts",
            filters: [{ field: "published", operator: "=", value: true }],
            limit: 5,
          },
        ],
        aggregates: [{ relation: "posts", type: "count" }],
        instructions: [
          { name: "cache", fields: [{ name: "duration", value: 3600 }] },
        ],
        Gates: ["view", "update"],
        page: 2,
        limit: 25,
      });
    });
  });
});

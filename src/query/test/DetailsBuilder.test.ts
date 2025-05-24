import { describe, it, expect, vi, beforeEach } from "vitest";
import { DetailsResponse, IQuery } from "../types";
import { DetailsBuilder } from "../DetailsBuilder";

interface TestUser {
  id: number;
  name: string;
  email: string;
  posts: Array<{ id: number; title: string }>;
  profile: { bio: string; avatar: string };
}

const createMockQuery = (): IQuery<TestUser> => ({
  search: vi.fn(),
  details: vi.fn().mockResolvedValue({
    data: {
      actions: [],
      instructions: [],
      fields: ["id", "name", "email"],
      limits: [10, 50, 100],
      scopes: ["active", "verified"],
      relations: [],
      rules: {},
    },
  } as DetailsResponse),
});

describe("DetailsBuilder", () => {
  let mockQuery: IQuery<TestUser>;
  let builder: DetailsBuilder<TestUser>;

  beforeEach(() => {
    mockQuery = createMockQuery();
    builder = new DetailsBuilder(mockQuery);
  });

  describe("constructor", () => {
    it("should create instance with query", () => {
      const builderWithQuery = new DetailsBuilder(mockQuery);
      expect(builderWithQuery).toBeInstanceOf(DetailsBuilder);
    });

    it("should create instance without query", () => {
      const builderWithoutQuery = new DetailsBuilder<TestUser>();
      expect(builderWithoutQuery).toBeInstanceOf(DetailsBuilder);
    });
  });

  describe("withHeaders", () => {
    it("should set headers", () => {
      const headers = {
        Authorization: "Bearer token",
        "Content-Type": "application/json",
      };
      const result = builder.withHeaders(headers);

      expect(result).toBe(builder);
      expect(builder.build().headers).toEqual(headers);
    });

    it("should merge with existing headers", () => {
      const firstHeaders = { Authorization: "Bearer token" };
      const secondHeaders = { "Content-Type": "application/json" };

      builder.withHeaders(firstHeaders).withHeaders(secondHeaders);

      expect(builder.build().headers).toEqual({
        Authorization: "Bearer token",
        "Content-Type": "application/json",
      });
    });

    it("should override existing headers with same key", () => {
      const firstHeaders = { Authorization: "Bearer old-token" };
      const secondHeaders = { Authorization: "Bearer new-token" };

      builder.withHeaders(firstHeaders).withHeaders(secondHeaders);

      expect(builder.build().headers).toEqual({
        Authorization: "Bearer new-token",
      });
    });
  });

  describe("withHeader", () => {
    it("should set single header", () => {
      const result = builder.withHeader("Authorization", "Bearer token");

      expect(result).toBe(builder);
      expect(builder.build().headers).toEqual({
        Authorization: "Bearer token",
      });
    });

    it("should add multiple headers with multiple calls", () => {
      builder
        .withHeader("Authorization", "Bearer token")
        .withHeader("Content-Type", "application/json");

      expect(builder.build().headers).toEqual({
        Authorization: "Bearer token",
        "Content-Type": "application/json",
      });
    });

    it("should override existing header with same name", () => {
      builder
        .withHeader("Authorization", "Bearer old-token")
        .withHeader("Authorization", "Bearer new-token");

      expect(builder.build().headers).toEqual({
        Authorization: "Bearer new-token",
      });
    });
  });

  describe("withTimeout", () => {
    it("should set timeout", () => {
      const result = builder.withTimeout(5000);

      expect(result).toBe(builder);
      expect(builder.build().timeout).toBe(5000);
    });

    it("should override existing timeout", () => {
      builder.withTimeout(3000).withTimeout(8000);

      expect(builder.build().timeout).toBe(8000);
    });
  });

  describe("withField", () => {
    it("should set single field parameter", () => {
      const result = builder.withField("name");

      expect(result).toBe(builder);
      expect(builder.build().params).toEqual({
        fields: "name",
      });
    });

    it("should override existing fields parameter", () => {
      builder.withField("name").withField("email");

      expect(builder.build().params).toEqual({
        fields: "email",
      });
    });
  });

  describe("withFields", () => {
    it("should set multiple fields parameter", () => {
      const result = builder.withFields("name", "email", "id");

      expect(result).toBe(builder);
      expect(builder.build().params).toEqual({
        fields: "name,email,id",
      });
    });

    it("should handle single field", () => {
      builder.withFields("name");

      expect(builder.build().params).toEqual({
        fields: "name",
      });
    });

    it("should handle empty array", () => {
      builder.withFields();

      expect(builder.build().params).toEqual({
        fields: "",
      });
    });

    it("should override existing fields", () => {
      builder.withFields("name").withFields("email", "id");

      expect(builder.build().params).toEqual({
        fields: "email,id",
      });
    });
  });

  describe("withInclude", () => {
    it("should set single include parameter", () => {
      const result = builder.withInclude("posts");

      expect(result).toBe(builder);
      expect(builder.build().params).toEqual({
        include: "posts",
      });
    });

    it("should work with different relation types", () => {
      builder.withInclude("profile");

      expect(builder.build().params).toEqual({
        include: "profile",
      });
    });
  });

  describe("withIncludes", () => {
    it("should set multiple includes parameter", () => {
      const result = builder.withIncludes("posts", "profile");

      expect(result).toBe(builder);
      expect(builder.build().params).toEqual({
        include: "posts,profile",
      });
    });

    it("should handle single include", () => {
      builder.withIncludes("posts");

      expect(builder.build().params).toEqual({
        include: "posts",
      });
    });

    it("should handle empty array", () => {
      builder.withIncludes();

      expect(builder.build().params).toEqual({
        include: "",
      });
    });
  });

  describe("withParams", () => {
    it("should set multiple parameters", () => {
      const params = {
        page: 1,
        limit: 10,
        active: true,
        search: "test",
      };

      const result = builder.withParams(params);

      expect(result).toBe(builder);
      expect(builder.build().params).toEqual({
        page: "1",
        limit: "10",
        active: "true",
        search: "test",
      });
    });

    it("should merge with existing params", () => {
      builder
        .withParam("existing", "value")
        .withParams({ new: "param", another: 42 });

      expect(builder.build().params).toEqual({
        existing: "value",
        new: "param",
        another: "42",
      });
    });

    it("should override existing params with same key", () => {
      builder.withParam("key", "old").withParams({ key: "new" });

      expect(builder.build().params).toEqual({
        key: "new",
      });
    });

    it("should handle different value types", () => {
      builder.withParams({
        string: "text",
        number: 123,
        boolean: false,
        zero: 0,
      });

      expect(builder.build().params).toEqual({
        string: "text",
        number: "123",
        boolean: "false",
        zero: "0",
      });
    });
  });

  describe("withParam", () => {
    it("should set single parameter", () => {
      const result = builder.withParam("page", 1);

      expect(result).toBe(builder);
      expect(builder.build().params).toEqual({
        page: "1",
      });
    });

    it("should convert different types to string", () => {
      builder
        .withParam("string", "value")
        .withParam("number", 42)
        .withParam("boolean", true);

      expect(builder.build().params).toEqual({
        string: "value",
        number: "42",
        boolean: "true",
      });
    });

    it("should add multiple params with multiple calls", () => {
      builder
        .withParam("page", 1)
        .withParam("limit", 10)
        .withParam("sort", "name");

      expect(builder.build().params).toEqual({
        page: "1",
        limit: "10",
        sort: "name",
      });
    });
  });

  describe("withCredentials", () => {
    it("should set credentials", () => {
      const result = builder.withCredentials("include");

      expect(result).toBe(builder);
      expect(builder.build().credentials).toBe("include");
    });

    it("should handle different credential types", () => {
      builder.withCredentials("same-origin");
      expect(builder.build().credentials).toBe("same-origin");

      builder.withCredentials("omit");
      expect(builder.build().credentials).toBe("omit");
    });
  });

  describe("withSignal", () => {
    it("should set abort signal", () => {
      const controller = new AbortController();
      const result = builder.withSignal(controller.signal);

      expect(result).toBe(builder);
      expect(builder.build().signal).toBe(controller.signal);
    });

    it("should override existing signal", () => {
      const controller1 = new AbortController();
      const controller2 = new AbortController();

      builder.withSignal(controller1.signal).withSignal(controller2.signal);

      expect(builder.build().signal).toBe(controller2.signal);
    });
  });

  describe("withResponseType", () => {
    it("should set response type", () => {
      const result = builder.withResponseType("json");

      expect(result).toBe(builder);
      expect(builder.build().responseType).toBe("json");
    });

    it("should handle different response types", () => {
      const types: Array<"json" | "text" | "blob" | "arraybuffer"> = [
        "json",
        "text",
        "blob",
        "arraybuffer",
      ];

      types.forEach((type) => {
        builder.withResponseType(type);
        expect(builder.build().responseType).toBe(type);
      });
    });
  });

  describe("build", () => {
    it("should return empty config when no options set", () => {
      const config = builder.build();

      expect(config).toEqual({});
    });

    it("should return complete config with all options", () => {
      const controller = new AbortController();

      const config = builder
        .withHeaders({ Authorization: "Bearer token" })
        .withTimeout(5000)
        .withParams({ page: 1, limit: 10 })
        .withCredentials("include")
        .withSignal(controller.signal)
        .withResponseType("json")
        .build();

      expect(config).toEqual({
        headers: { Authorization: "Bearer token" },
        timeout: 5000,
        params: { page: "1", limit: "10" },
        credentials: "include",
        signal: controller.signal,
        responseType: "json",
      });
    });

    it("should return a new object each time", () => {
      const config1 = builder.build();
      const config2 = builder.build();

      if (
        Object.keys(config1).length === 0 &&
        Object.keys(config2).length === 0
      ) {
        expect(config1).toEqual(config2);
      } else {
        expect(config1).not.toBe(config2);
        expect(config1).toEqual(config2);
      }
    });
  });

  describe("details", () => {
    it("should call query instance details method", async () => {
      const expectedResponse: DetailsResponse = {
        data: {
          actions: [],
          instructions: [],
          fields: ["id", "name"],
          limits: [10],
          scopes: ["active"],
          relations: [],
          rules: {},
        },
      };

      vi.mocked(mockQuery.details).mockResolvedValue(expectedResponse);

      const result = await builder.details();

      expect(mockQuery.details).toHaveBeenCalledWith({});
      expect(result).toEqual(expectedResponse);
    });

    it("should pass built config to query instance", async () => {
      const config = {
        headers: { Authorization: "Bearer token" },
        timeout: 5000,
        params: { fields: "name,email" },
      };

      builder
        .withHeaders({ Authorization: "Bearer token" })
        .withTimeout(5000)
        .withFields("name", "email");

      await builder.details();

      expect(mockQuery.details).toHaveBeenCalledWith(config);
    });

    it("should throw error when no query instance provided", async () => {
      const builderWithoutQuery = new DetailsBuilder<TestUser>();

      await expect(builderWithoutQuery.details()).rejects.toThrow(
        "No query instance provided to execute the details request",
      );
    });

    it("should handle query errors", async () => {
      const error = new Error("Query failed");
      vi.mocked(mockQuery.details).mockRejectedValue(error);

      await expect(builder.details()).rejects.toThrow("Query failed");
    });
  });

  describe("method chaining", () => {
    it("should support method chaining", () => {
      const result = builder
        .withHeader("Authorization", "Bearer token")
        .withTimeout(5000)
        .withField("name")
        .withParam("page", 1)
        .withCredentials("include");

      expect(result).toBe(builder);

      const config = builder.build();
      expect(config).toEqual({
        headers: { Authorization: "Bearer token" },
        timeout: 5000,
        params: { fields: "name", page: "1" },
        credentials: "include",
      });
    });

    it("should allow building and calling details in chain", async () => {
      const expectedResponse: DetailsResponse = {
        data: {
          actions: [],
          instructions: [],
          fields: ["name"],
          limits: [10],
          scopes: [],
          relations: [],
          rules: {},
        },
      };

      vi.mocked(mockQuery.details).mockResolvedValue(expectedResponse);

      const result = await builder
        .withField("name")
        .withTimeout(3000)
        .details();

      expect(result).toEqual(expectedResponse);
      expect(mockQuery.details).toHaveBeenCalledWith({
        params: { fields: "name" },
        timeout: 3000,
      });
    });
  });

  describe("type safety", () => {
    it("should enforce field types", () => {
      builder.withField("name");
      builder.withField("email");
      builder.withField("id");

      builder.withFields("name", "email", "id");
    });

    it("should enforce relation types", () => {
      builder.withInclude("posts");
      builder.withInclude("profile");

      builder.withIncludes("posts", "profile");
    });
  });

  describe("edge cases", () => {
    it("should handle empty strings in params", () => {
      builder.withParam("empty", "");

      expect(builder.build().params).toEqual({
        empty: "",
      });
    });

    it("should handle zero values", () => {
      builder.withParam("zero", 0);

      expect(builder.build().params).toEqual({
        zero: "0",
      });
    });

    it("should handle false boolean values", () => {
      builder.withParam("false", false);

      expect(builder.build().params).toEqual({
        false: "false",
      });
    });

    it("should handle complex parameter combinations", () => {
      builder
        .withFields("name", "email")
        .withIncludes("posts", "profile")
        .withParams({ page: 1, limit: 10 })
        .withParam("sort", "created_at");

      expect(builder.build().params).toEqual({
        fields: "name,email",
        include: "posts,profile",
        page: "1",
        limit: "10",
        sort: "created_at",
      });
    });
  });

  describe("immutability", () => {
    it("should not modify original headers object", () => {
      const originalHeaders = { Authorization: "Bearer token" };
      const headersCopy = { ...originalHeaders };

      builder.withHeaders(originalHeaders);
      builder.withHeader("Content-Type", "application/json");

      expect(originalHeaders).toEqual(headersCopy);
    });

    it("should not modify original params object", () => {
      const originalParams = { page: 1, limit: 10 };
      const paramsCopy = { ...originalParams };

      builder.withParams(originalParams);
      builder.withParam("sort", "name");

      expect(originalParams).toEqual(paramsCopy);
    });
  });
});

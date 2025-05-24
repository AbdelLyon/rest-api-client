import { describe, it, expect, beforeEach } from "vitest";
import { CreationRelation } from "../builder/CreationRelation";

describe("CreationRelation", () => {
  let creationRelation: CreationRelation;

  beforeEach(() => {
    creationRelation = new CreationRelation();
  });

  describe("add", () => {
    it("should create a create operation with attributes only", () => {
      const attributes = { name: "test", email: "test@example.com" };
      const params = { attributes };

      const result = creationRelation.add(params);

      expect(result).toEqual({
        operation: "create",
        attributes,
        relations: {},
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });

    it("should create a create operation with attributes and relations", () => {
      const attributes = { name: "test" };
      const relations = { posts: [] };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params = { attributes, relations } as any;

      const result = creationRelation.add(params);

      expect(result).toEqual({
        operation: "create",
        attributes,
        relations,
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });

    it("should handle empty relations when not provided", () => {
      const attributes = { name: "test" };
      const params = { attributes };

      const result = creationRelation.add(params);

      expect(result.relations).toEqual({});
    });
  });

  describe("attach", () => {
    it("should create an attach operation with simple key", () => {
      const key = 1;

      const result = creationRelation.attach(key);

      expect(result).toEqual({
        operation: "attach",
        key,
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });

    it("should create an attach operation with string key", () => {
      const key = "test-key";

      const result = creationRelation.attach(key);

      expect(result).toEqual({
        operation: "attach",
        key,
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });

    it("should create an attach operation with array key", () => {
      const key = [1, 2, 3];

      const result = creationRelation.attach(key);

      expect(result).toEqual({
        operation: "attach",
        key,
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });
  });

  describe("__relationDefinition property", () => {
    it("should set __relationDefinition as non-enumerable", () => {
      const result = creationRelation.attach(1);
      const descriptor = Object.getOwnPropertyDescriptor(
        result,
        "__relationDefinition",
      );

      expect(descriptor?.enumerable).toBe(false);
      expect(descriptor?.writable).toBe(false);
      expect(descriptor?.configurable).toBe(true);
      expect(descriptor?.value).toBe(true);
    });

    it("should not appear in Object.keys()", () => {
      const result = creationRelation.attach(1);
      const keys = Object.keys(result);

      expect(keys).not.toContain("__relationDefinition");
    });
  });
});

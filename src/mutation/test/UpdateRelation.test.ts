import { describe, it, expect, beforeEach } from "vitest";
import { UpdateRelation } from "../builder/UpdateRelation";

describe("UpdateRelation", () => {
  let updateRelation: UpdateRelation;

  beforeEach(() => {
    updateRelation = new UpdateRelation();
  });

  describe("add", () => {
    it("should create a create operation", () => {
      const attributes = { name: "test", email: "test@example.com" };
      const params = { attributes };

      const result = updateRelation.add(params);

      expect(result).toEqual({
        operation: "create",
        attributes,
        relations: {},
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });
  });

  describe("edit", () => {
    it("should create an update operation", () => {
      const key = 1;
      const attributes = { name: "updated" };
      const params = { key, attributes };

      const result = updateRelation.edit(params);

      expect(result).toEqual({
        operation: "update",
        key,
        attributes,
        relations: {},
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });

    it("should handle relations in update operation", () => {
      const key = 1;
      const attributes = { name: "updated" };
      const relations = { posts: {} };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params = { key, attributes, relations } as any;

      const result = updateRelation.edit(params);

      expect(result).toEqual({
        operation: "update",
        key,
        attributes,
        relations,
      });
    });
  });

  describe("attach", () => {
    it("should create an attach operation", () => {
      const key = 1;

      const result = updateRelation.attach(key);

      expect(result).toEqual({
        operation: "attach",
        key,
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });
  });

  describe("detach", () => {
    it("should create a detach operation", () => {
      const key = 1;

      const result = updateRelation.detach(key);

      expect(result).toEqual({
        operation: "detach",
        key,
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });
  });

  describe("sync", () => {
    it("should create a sync operation with all parameters", () => {
      const params = {
        key: [1, 2, 3],
        attributes: { name: "test" },
        pivot: { role: "admin" },
        withoutDetaching: true,
      };

      const result = updateRelation.sync(params);

      expect(result).toEqual({
        operation: "sync",
        key: params.key,
        without_detaching: true,
        attributes: params.attributes,
        pivot: params.pivot,
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });

    it("should create a sync operation with minimal parameters", () => {
      const key = 1;

      const result = updateRelation.sync({ key });

      expect(result).toEqual({
        operation: "sync",
        key,
        without_detaching: undefined,
      });
    });
  });

  describe("toggle", () => {
    it("should create a toggle operation with all parameters", () => {
      const params = {
        key: [1, 2],
        attributes: { active: true },
        pivot: { priority: 1 },
      };

      const result = updateRelation.toggle(params);

      expect(result).toEqual({
        operation: "toggle",
        key: params.key,
        attributes: params.attributes,
        pivot: params.pivot,
      });
      expect(result).toHaveProperty("__relationDefinition", true);
    });

    it("should create a toggle operation with minimal parameters", () => {
      const key = "test";

      const result = updateRelation.toggle({ key });

      expect(result).toEqual({
        operation: "toggle",
        key,
      });
    });
  });
});

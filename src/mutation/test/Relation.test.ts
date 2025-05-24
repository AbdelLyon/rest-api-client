import { describe, it, expect, beforeEach } from "vitest";
import { Relation } from "../builder/Relation";

describe("Relation", () => {
  let relation: Relation;

  beforeEach(() => {
    Relation.getInstance();
    relation = Relation.getInstance();
  });

  describe("getInstance", () => {
    it("should return the same instance (singleton)", () => {
      const instance1 = Relation.getInstance();
      const instance2 = Relation.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("setContext", () => {
    it("should set context to create", () => {
      relation.setContext("create");
      // Le contexte est privé, on le teste indirectement via les méthodes
      expect(() =>
        relation.add({ attributes: { name: "test" } }),
      ).not.toThrow();
    });

    it("should set context to update", () => {
      relation.setContext("update");
      expect(() =>
        relation.edit({ key: 1, attributes: { name: "test" } }),
      ).not.toThrow();
    });
  });

  describe("add", () => {
    it("should work in both create and update context", () => {
      const attributes = { name: "test" };

      relation.setContext("create");
      const createResult = relation.add({ attributes });

      relation.setContext("update");
      const updateResult = relation.add({ attributes });

      expect(createResult).toEqual({
        operation: "create",
        attributes,
        relations: {},
      });
      expect(updateResult).toEqual(createResult);
    });
  });

  describe("attach", () => {
    it("should work in both create and update context", () => {
      const key = 1;

      relation.setContext("create");
      const createResult = relation.attach(key);

      relation.setContext("update");
      const updateResult = relation.attach(key);

      expect(createResult).toEqual({
        operation: "attach",
        key,
      });
      expect(updateResult).toEqual(createResult);
    });
  });

  describe("edit", () => {
    it("should work in update context", () => {
      relation.setContext("update");
      const key = 1;
      const attributes = { name: "updated" };

      const result = relation.edit({ key, attributes });

      expect(result).toEqual({
        operation: "update",
        key,
        attributes,
        relations: {},
      });
    });

    it("should throw error in create context", () => {
      relation.setContext("create");

      expect(() =>
        relation.edit({ key: 1, attributes: { name: "test" } }),
      ).toThrow(
        "Cannot use method 'edit' in creation context. Only 'add' and 'attach' methods are allowed.",
      );
    });
  });

  describe("detach", () => {
    it("should work in update context", () => {
      relation.setContext("update");
      const key = 1;

      const result = relation.detach(key);

      expect(result).toEqual({
        operation: "detach",
        key,
      });
    });

    it("should throw error in create context", () => {
      relation.setContext("create");

      expect(() => relation.detach(1)).toThrow(
        "Cannot use method 'detach' in creation context. Only 'add' and 'attach' methods are allowed.",
      );
    });
  });

  describe("sync", () => {
    it("should work with all parameters", () => {
      relation.setContext("update");
      const params = {
        key: [1, 2, 3],
        attributes: { name: "test" },
        pivot: { role: "admin" },
        withoutDetaching: true,
      };

      const result = relation.sync(params);

      expect(result).toEqual({
        operation: "sync",
        key: params.key,
        without_detaching: true,
        attributes: params.attributes,
        pivot: params.pivot,
      });
    });

    it("should work with minimal parameters", () => {
      relation.setContext("update");
      const key = 1;

      const result = relation.sync({ key });

      expect(result).toEqual({
        operation: "sync",
        key,
        without_detaching: undefined,
      });
    });

    it("should throw error in create context", () => {
      relation.setContext("create");

      expect(() => relation.sync({ key: 1 })).toThrow(
        "Cannot use method 'sync' in creation context. Only 'add' and 'attach' methods are allowed.",
      );
    });
  });

  describe("toggle", () => {
    it("should work with all parameters", () => {
      relation.setContext("update");
      const params = {
        key: [1, 2],
        attributes: { active: true },
        pivot: { priority: 1 },
      };

      const result = relation.toggle(params);

      expect(result).toEqual({
        operation: "toggle",
        key: params.key,
        attributes: params.attributes,
        pivot: params.pivot,
      });
    });

    it("should work with minimal parameters", () => {
      relation.setContext("update");
      const key = "test";

      const result = relation.toggle({ key });

      expect(result).toEqual({
        operation: "toggle",
        key,
      });
    });

    it("should throw error in create context", () => {
      relation.setContext("create");

      expect(() => relation.toggle({ key: 1 })).toThrow(
        "Cannot use method 'toggle' in creation context. Only 'add' and 'attach' methods are allowed.",
      );
    });
  });
});

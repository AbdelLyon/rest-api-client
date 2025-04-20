var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { RelationBuilder } from "./RelationBuilder.js";
class EntityBuilder extends RelationBuilder {
  constructor(relationBuilder) {
    super();
    __publicField(this, "operations", []);
    __publicField(this, "mutationFn", null);
    __publicField(this, "relationBuilder");
    this.relationBuilder = relationBuilder;
  }
  extractOperationData(attributes) {
    const normalAttributes = {};
    const relations = {};
    for (const [key, value] of Object.entries(attributes)) {
      if (value && typeof value === "object" && "operation" in value) {
        relations[key] = value;
      } else {
        normalAttributes[key] = value;
      }
    }
    return { normalAttributes, relations };
  }
  setMutationFunction(fn) {
    this.mutationFn = fn;
  }
  createEntity(attributes) {
    const { normalAttributes, relations } = this.extractOperationData(attributes);
    const operation = {
      operation: "create",
      attributes: normalAttributes,
      relations
    };
    this.operations.push(operation);
    return this;
  }
  updateEntity(key, attributes) {
    const { normalAttributes, relations } = this.extractOperationData(attributes);
    const operation = {
      operation: "update",
      key,
      attributes: normalAttributes,
      relations
    };
    this.operations.push(operation);
    return this;
  }
  build() {
    const result = [...this.operations];
    this.operations = [];
    return { mutate: result };
  }
  async mutate(options) {
    if (!this.mutationFn) {
      throw new Error("Mutation function not provided to builder");
    }
    const data = this.build();
    return this.mutationFn(data, options);
  }
  createRelation(params) {
    const { attributes, relations } = params;
    return this.relationBuilder.createRelation({
      attributes,
      relations
    });
  }
  updateRelation(params) {
    const { key, attributes, relations } = params;
    return this.relationBuilder.updateRelation({
      key,
      attributes,
      relations
    });
  }
  attach(key) {
    return this.relationBuilder.attach(key);
  }
  detach(key) {
    return this.relationBuilder.detach(key);
  }
  sync(params) {
    const { key, attributes, pivot, withoutDetaching } = params;
    return this.relationBuilder.sync({
      key,
      attributes,
      pivot,
      withoutDetaching
    });
  }
  toggle(params) {
    const { key, attributes, pivot } = params;
    return this.relationBuilder.toggle({
      key,
      attributes,
      pivot
    });
  }
}
export {
  EntityBuilder
};
//# sourceMappingURL=EntityBuilder.js.map

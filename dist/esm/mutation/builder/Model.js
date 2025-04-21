var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { Relation } from "./Relation.js";
class Model {
  constructor() {
    __publicField(this, "operations", []);
    __publicField(this, "mutationFn", null);
  }
  setMutationFunction(fn) {
    this.mutationFn = fn;
  }
  create(params) {
    const { attributes, relations = {} } = params;
    const operation = {
      operation: "create",
      attributes,
      relations
    };
    this.operations.push(operation);
    const creationRelation = new Relation();
    creationRelation.setContext("create");
    return {
      build: this.build.bind(this),
      mutate: this.mutate.bind(this),
      relation: creationRelation
    };
  }
  update(key, params) {
    const { attributes = {}, relations = {} } = params;
    const operation = {
      operation: "update",
      key,
      attributes,
      relations
    };
    this.operations.push(operation);
    const updateRelation = new Relation();
    updateRelation.setContext("update");
    return {
      build: this.build.bind(this),
      mutate: this.mutate.bind(this),
      relation: updateRelation
    };
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
}
export {
  Model
};
//# sourceMappingURL=Model.js.map

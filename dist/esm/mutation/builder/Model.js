var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { Relation } from "./Relation.js";
class Model extends Relation {
  constructor(relation) {
    super();
    __publicField(this, "operations", []);
    __publicField(this, "mutationFn", null);
    __publicField(this, "relation");
    this.relation = relation;
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
    return {
      build: this.build.bind(this),
      mutate: this.mutate.bind(this)
    };
  }
  update(key, params) {
    const { attributes, relations = {} } = params;
    const operation = {
      operation: "update",
      key,
      attributes,
      relations
    };
    this.operations.push(operation);
    return {
      build: this.build.bind(this),
      mutate: this.mutate.bind(this)
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
  add(params) {
    const { attributes, relations } = params;
    return this.relation.add({
      attributes,
      relations
    });
  }
  edit(params) {
    const { key, attributes, relations } = params;
    return this.relation.edit({
      key,
      attributes,
      relations
    });
  }
  attach(key) {
    return this.relation.attach(key);
  }
  detach(key) {
    return this.relation.detach(key);
  }
  sync(params) {
    const { key, attributes, pivot, withoutDetaching } = params;
    return this.relation.sync({
      key,
      attributes,
      pivot,
      withoutDetaching
    });
  }
  toggle(params) {
    const { key, attributes, pivot } = params;
    return this.relation.toggle({
      key,
      attributes,
      pivot
    });
  }
}
export {
  Model
};
//# sourceMappingURL=Model.js.map

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { RelationBuilder } from "../RelationBuilder/index.es.js";
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
  mutate(options) {
    return __async(this, null, function* () {
      if (!this.mutationFn) {
        throw new Error("Mutation function not provided to builder");
      }
      const data = this.build();
      return this.mutationFn(data, options);
    });
  }
  createRelation(attributes, relations) {
    return this.relationBuilder.createRelation(attributes, relations);
  }
  updateRelation(key, attributes, relations) {
    return this.relationBuilder.updateRelation(key, attributes, relations);
  }
  attach(key) {
    return this.relationBuilder.attach(key);
  }
  detach(key) {
    return this.relationBuilder.detach(key);
  }
  sync(key, attributes, pivot, withoutDetaching) {
    return this.relationBuilder.sync(key, attributes, pivot, withoutDetaching);
  }
  toggle(key, attributes, pivot) {
    return this.relationBuilder.toggle(key, attributes, pivot);
  }
}
export {
  EntityBuilder
};

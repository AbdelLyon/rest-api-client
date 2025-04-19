var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
import { HttpClient } from "../http/index.es.js";
class RelationBuilder {
  defineRelationDefinition(result) {
    Object.defineProperty(result, "__relationDefinition", {
      value: true,
      enumerable: false,
      writable: false,
      configurable: true
    });
  }
  extractNestedRelations(attributes) {
    const normalAttributes = {};
    const nestedRelations = {};
    for (const [key, value] of Object.entries(attributes)) {
      if (value && typeof value === "object" && "operation" in value) {
        nestedRelations[key] = value;
      } else {
        normalAttributes[key] = value;
      }
    }
    return { normalAttributes, nestedRelations };
  }
  addGetters(relationDefinition, normalAttributes) {
    for (const key of Object.keys(normalAttributes)) {
      Object.defineProperty(relationDefinition, key, {
        get() {
          return normalAttributes[key];
        },
        enumerable: true
      });
    }
  }
  createRelation(attributes, relations) {
    const { normalAttributes, nestedRelations: initialNestedRelations } = this.extractNestedRelations(attributes);
    const nestedRelations = relations ? __spreadValues(__spreadValues({}, initialNestedRelations), relations) : initialNestedRelations;
    const relationDefinition = __spreadValues({
      operation: "create",
      attributes: normalAttributes
    }, Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {});
    this.defineRelationDefinition(relationDefinition);
    this.addGetters(relationDefinition, normalAttributes);
    return relationDefinition;
  }
  updateRelation(key, attributes, relations) {
    const { normalAttributes, nestedRelations: initialNestedRelations } = this.extractNestedRelations(attributes);
    const nestedRelations = relations ? __spreadValues(__spreadValues({}, initialNestedRelations), relations) : initialNestedRelations;
    const relationDefinition = __spreadValues({
      operation: "update",
      key,
      attributes: normalAttributes
    }, Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {});
    this.defineRelationDefinition(relationDefinition);
    this.addGetters(relationDefinition, normalAttributes);
    return relationDefinition;
  }
  attach(key) {
    const result = {
      operation: "attach",
      key
    };
    this.defineRelationDefinition(result);
    return result;
  }
  detach(key) {
    const result = {
      operation: "detach",
      key
    };
    this.defineRelationDefinition(result);
    return result;
  }
  sync(key, attributes, pivot, withoutDetaching) {
    const result = __spreadValues(__spreadValues({
      operation: "sync",
      key,
      without_detaching: withoutDetaching
    }, attributes && { attributes }), pivot && { pivot });
    this.defineRelationDefinition(result);
    return result;
  }
  toggle(key, attributes, pivot) {
    const result = __spreadValues(__spreadValues({
      operation: "toggle",
      key
    }, attributes && { attributes }), pivot && { pivot });
    this.defineRelationDefinition(result);
    return result;
  }
}
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
const _Builder = class _Builder {
  static getRelationBuilder() {
    if (!_Builder.relationInstance) {
      _Builder.relationInstance = new RelationBuilder();
    }
    return _Builder.relationInstance;
  }
  static createEntityBuilder(relationBuilder) {
    return new EntityBuilder(relationBuilder || _Builder.getRelationBuilder());
  }
};
__publicField(_Builder, "relationInstance");
let Builder = _Builder;
class Mutation {
  constructor(pathname, schema) {
    __publicField(this, "http");
    __publicField(this, "pathname");
    __publicField(this, "schema");
    __publicField(this, "relation");
    this.http = HttpClient.getInstance();
    this.pathname = pathname;
    this.schema = schema;
    this.relation = Builder.getRelationBuilder();
  }
  entityBuilder() {
    const builder = Builder.createEntityBuilder(this.relation);
    builder.setMutationFunction((data, options) => this.mutate(data, options));
    return builder;
  }
  relationBuilder() {
    return this.relation;
  }
  validateData(data) {
    return data.map((item) => {
      const result = this.schema.safeParse(item);
      if (!result.success) {
        console.error("Type validation failed:", result.error.errors);
        throw new Error(
          `Type validation failed: ${JSON.stringify(result.error.errors)}`
        );
      }
      return result.data;
    });
  }
  mutate(mutateRequest, options) {
    return __async(this, null, function* () {
      const data = "build" in mutateRequest ? mutateRequest.build() : mutateRequest;
      const response = yield this.http.request(
        {
          method: "POST",
          url: `${this.pathname}/mutate`,
          data
        },
        options
      );
      return response;
    });
  }
  executeAction(actionRequest, options = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/actions/${actionRequest.action}`,
        data: actionRequest.payload
      },
      options
    );
  }
  delete(_0) {
    return __async(this, arguments, function* (request, options = {}) {
      const response = yield this.http.request(
        {
          method: "DELETE",
          url: this.pathname,
          data: request
        },
        options
      );
      return __spreadProps(__spreadValues({}, response), {
        data: this.validateData(response.data)
      });
    });
  }
  forceDelete(_0) {
    return __async(this, arguments, function* (request, options = {}) {
      const response = yield this.http.request(
        {
          method: "DELETE",
          url: `${this.pathname}/force`,
          data: request
        },
        options
      );
      return __spreadProps(__spreadValues({}, response), {
        data: this.validateData(response.data)
      });
    });
  }
  restore(_0) {
    return __async(this, arguments, function* (request, options = {}) {
      const response = yield this.http.request(
        {
          method: "POST",
          url: `${this.pathname}/restore`,
          data: request
        },
        options
      );
      return __spreadProps(__spreadValues({}, response), {
        data: this.validateData(response.data)
      });
    });
  }
}
export {
  Mutation
};

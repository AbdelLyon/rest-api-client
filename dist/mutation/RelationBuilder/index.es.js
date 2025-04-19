var __defProp = Object.defineProperty;
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
export {
  RelationBuilder
};

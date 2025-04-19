"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const EntityBuilder = require("./EntityBuilder.cjs");
const RelationBuilder = require("./RelationBuilder.cjs");
const _Builder = class _Builder {
  static getRelationBuilder() {
    return _Builder.relationInstance;
  }
  static createEntityBuilder(relationBuilder) {
    return new EntityBuilder.EntityBuilder(relationBuilder || _Builder.getRelationBuilder());
  }
};
__publicField(_Builder, "relationInstance", new RelationBuilder.RelationBuilder());
let Builder = _Builder;
exports.Builder = Builder;
//# sourceMappingURL=Builder.cjs.map

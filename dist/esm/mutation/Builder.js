var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { EntityBuilder } from "./EntityBuilder.js";
import { RelationBuilder } from "./RelationBuilder.js";
const _Builder = class _Builder {
  static getRelationBuilder() {
    return _Builder.relationInstance;
  }
  static createEntityBuilder(relationBuilder) {
    return new EntityBuilder(relationBuilder || _Builder.getRelationBuilder());
  }
};
__publicField(_Builder, "relationInstance", new RelationBuilder());
let Builder = _Builder;
export {
  Builder
};
//# sourceMappingURL=Builder.js.map

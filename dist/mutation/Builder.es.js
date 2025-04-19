var o = Object.defineProperty;
var l = (n, t, i) => t in n ? o(n, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : n[t] = i;
var r = (n, t, i) => l(n, typeof t != "symbol" ? t + "" : t, i);
import { EntityBuilder as c } from "./EntityBuilder.es.js";
import { RelationBuilder as s } from "./RelationBuilder.es.js";
const e = class e {
  static getRelationBuilder() {
    return e.relationInstance || (e.relationInstance = new s()), e.relationInstance;
  }
  static createEntityBuilder(t) {
    return new c(t || e.getRelationBuilder());
  }
};
r(e, "relationInstance");
let a = e;
export {
  a as Builder
};
//# sourceMappingURL=Builder.es.js.map

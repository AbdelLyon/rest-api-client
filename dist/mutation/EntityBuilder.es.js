var u = Object.defineProperty;
var l = (a, i, t) => i in a ? u(a, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[i] = t;
var s = (a, i, t) => l(a, typeof i != "symbol" ? i + "" : i, t);
import { RelationBuilder as c } from "./RelationBuilder.es.js";
class d extends c {
  constructor(t) {
    super();
    s(this, "operations", []);
    s(this, "mutationFn", null);
    s(this, "relationBuilder");
    this.relationBuilder = t;
  }
  extractOperationData(t) {
    const e = {}, r = {};
    for (const [n, o] of Object.entries(t))
      o && typeof o == "object" && "operation" in o ? r[n] = o : e[n] = o;
    return { normalAttributes: e, relations: r };
  }
  setMutationFunction(t) {
    this.mutationFn = t;
  }
  createEntity(t) {
    const { normalAttributes: e, relations: r } = this.extractOperationData(t), n = {
      operation: "create",
      attributes: e,
      relations: r
    };
    return this.operations.push(n), this;
  }
  updateEntity(t, e) {
    const { normalAttributes: r, relations: n } = this.extractOperationData(e), o = {
      operation: "update",
      key: t,
      attributes: r,
      relations: n
    };
    return this.operations.push(o), this;
  }
  build() {
    const t = [...this.operations];
    return this.operations = [], { mutate: t };
  }
  async mutate(t) {
    if (!this.mutationFn)
      throw new Error("Mutation function not provided to builder");
    const e = this.build();
    return this.mutationFn(e, t);
  }
  createRelation(t, e) {
    return this.relationBuilder.createRelation(t, e);
  }
  updateRelation(t, e, r) {
    return this.relationBuilder.updateRelation(t, e, r);
  }
  attach(t) {
    return this.relationBuilder.attach(t);
  }
  detach(t) {
    return this.relationBuilder.detach(t);
  }
  sync(t, e, r, n) {
    return this.relationBuilder.sync(t, e, r, n);
  }
  toggle(t, e, r) {
    return this.relationBuilder.toggle(t, e, r);
  }
}
export {
  d as EntityBuilder
};
//# sourceMappingURL=EntityBuilder.es.js.map

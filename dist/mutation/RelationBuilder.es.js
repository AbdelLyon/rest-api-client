class l {
  defineRelationDefinition(t) {
    Object.defineProperty(t, "__relationDefinition", {
      value: !0,
      enumerable: !1,
      writable: !1,
      configurable: !0
    });
  }
  extractNestedRelations(t) {
    const e = {}, n = {};
    for (const [o, i] of Object.entries(t))
      i && typeof i == "object" && "operation" in i ? n[o] = i : e[o] = i;
    return { normalAttributes: e, nestedRelations: n };
  }
  addGetters(t, e) {
    for (const n of Object.keys(e))
      Object.defineProperty(t, n, {
        get() {
          return e[n];
        },
        enumerable: !0
      });
  }
  createRelation(t, e) {
    const { normalAttributes: n, nestedRelations: o } = this.extractNestedRelations(t), i = e ? { ...o, ...e } : o, s = {
      operation: "create",
      attributes: n,
      ...Object.keys(i).length > 0 ? { relations: i } : {}
    };
    return this.defineRelationDefinition(s), this.addGetters(s, n), s;
  }
  updateRelation(t, e, n) {
    const { normalAttributes: o, nestedRelations: i } = this.extractNestedRelations(e), s = n ? { ...i, ...n } : i, a = {
      operation: "update",
      key: t,
      attributes: o,
      ...Object.keys(s).length > 0 ? { relations: s } : {}
    };
    return this.defineRelationDefinition(a), this.addGetters(a, o), a;
  }
  attach(t) {
    const e = {
      operation: "attach",
      key: t
    };
    return this.defineRelationDefinition(e), e;
  }
  detach(t) {
    const e = {
      operation: "detach",
      key: t
    };
    return this.defineRelationDefinition(e), e;
  }
  sync(t, e, n, o) {
    const i = {
      operation: "sync",
      key: t,
      without_detaching: o,
      ...e && { attributes: e },
      ...n && { pivot: n }
    };
    return this.defineRelationDefinition(i), i;
  }
  toggle(t, e, n) {
    const o = {
      operation: "toggle",
      key: t,
      ...e && { attributes: e },
      ...n && { pivot: n }
    };
    return this.defineRelationDefinition(o), o;
  }
}
export {
  l as RelationBuilder
};
//# sourceMappingURL=RelationBuilder.es.js.map

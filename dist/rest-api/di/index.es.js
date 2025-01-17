import { a as p, I as b, T as f } from "../../tokens-DbFzGZEv.js";
var c = Object.defineProperty, o = (t, e, n) => e in t ? c(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, a = (t, e, n) => o(t, typeof e != "symbol" ? e + "" : e, n);
class r {
  static reset() {
    this.instances.clear(), this.bindings.clear();
  }
  static bind(e) {
    return {
      to: (n) => {
        this.bindings.set(e, n);
      },
      toInstance: (n) => {
        this.instances.set(e, n);
      }
    };
  }
  static resolve(e) {
    const n = this.instances.get(e);
    if (n !== void 0)
      return n;
    const s = this.bindings.get(e) ?? e;
    if (s == null)
      throw new Error(`No binding found for ${String(e)}`);
    const i = this.createInstance(s);
    return this.instances.set(s, i), i;
  }
  static createInstance(e) {
    const s = (Reflect.getMetadata("design:paramtypes", e) ?? []).map(
      (i) => this.resolve(i)
    );
    return new e(...s);
  }
}
a(r, "instances", /* @__PURE__ */ new Map());
a(r, "bindings", /* @__PURE__ */ new Map());
export {
  r as Container,
  p as Inject,
  b as Injectable,
  f as TOKENS
};

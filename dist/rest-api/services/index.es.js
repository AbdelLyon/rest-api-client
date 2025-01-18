import N from "axios-retry";
import Ne from "axios";
var ce = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, de = {};
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var le;
function Be() {
  if (le) return de;
  le = 1;
  var y;
  return function(n) {
    (function(f) {
      var p = typeof globalThis == "object" ? globalThis : typeof ce == "object" ? ce : typeof self == "object" ? self : typeof this == "object" ? this : A(), M = E(n);
      typeof p.Reflect < "u" && (M = E(p.Reflect, M)), f(M, p), typeof p.Reflect > "u" && (p.Reflect = n);
      function E(I, x) {
        return function(T, S) {
          Object.defineProperty(I, T, { configurable: !0, writable: !0, value: S }), x && x(T, S);
        };
      }
      function F() {
        try {
          return Function("return this;")();
        } catch {
        }
      }
      function P() {
        try {
          return (0, eval)("(function() { return this; })()");
        } catch {
        }
      }
      function A() {
        return F() || P();
      }
    })(function(f, p) {
      var M = Object.prototype.hasOwnProperty, E = typeof Symbol == "function", F = E && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", P = E && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", A = typeof Object.create == "function", I = { __proto__: [] } instanceof Array, x = !A && !I, T = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: A ? function() {
          return L(/* @__PURE__ */ Object.create(null));
        } : I ? function() {
          return L({ __proto__: null });
        } : function() {
          return L({});
        },
        has: x ? function(e, t) {
          return M.call(e, t);
        } : function(e, t) {
          return t in e;
        },
        get: x ? function(e, t) {
          return M.call(e, t) ? e[t] : void 0;
        } : function(e, t) {
          return e[t];
        }
      }, S = Object.getPrototypeOf(Function), C = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : He(), G = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : Ue(), H = typeof WeakMap == "function" ? WeakMap : $e(), R = E ? Symbol.for("@reflect-metadata:registry") : void 0, q = De(), z = Fe(q);
      function _e(e, t, r, a) {
        if (d(r)) {
          if (!re(e))
            throw new TypeError();
          if (!ne(t))
            throw new TypeError();
          return Re(e, t);
        } else {
          if (!re(e))
            throw new TypeError();
          if (!_(t))
            throw new TypeError();
          if (!_(a) && !d(a) && !k(a))
            throw new TypeError();
          return k(a) && (a = void 0), r = O(r), ke(e, t, r, a);
        }
      }
      f("decorate", _e);
      function me(e, t) {
        function r(a, c) {
          if (!_(a))
            throw new TypeError();
          if (!d(c) && !Ae(c))
            throw new TypeError();
          X(e, t, a, c);
        }
        return r;
      }
      f("metadata", me);
      function ge(e, t, r, a) {
        if (!_(r))
          throw new TypeError();
        return d(a) || (a = O(a)), X(e, t, r, a);
      }
      f("defineMetadata", ge);
      function Me(e, t, r) {
        if (!_(t))
          throw new TypeError();
        return d(r) || (r = O(r)), Z(e, t, r);
      }
      f("hasMetadata", Me);
      function be(e, t, r) {
        if (!_(t))
          throw new TypeError();
        return d(r) || (r = O(r)), U(e, t, r);
      }
      f("hasOwnMetadata", be);
      function Oe(e, t, r) {
        if (!_(t))
          throw new TypeError();
        return d(r) || (r = O(r)), Q(e, t, r);
      }
      f("getMetadata", Oe);
      function Ee(e, t, r) {
        if (!_(t))
          throw new TypeError();
        return d(r) || (r = O(r)), J(e, t, r);
      }
      f("getOwnMetadata", Ee);
      function Te(e, t) {
        if (!_(e))
          throw new TypeError();
        return d(t) || (t = O(t)), Y(e, t);
      }
      f("getMetadataKeys", Te);
      function Pe(e, t) {
        if (!_(e))
          throw new TypeError();
        return d(t) || (t = O(t)), K(e, t);
      }
      f("getOwnMetadataKeys", Pe);
      function Ie(e, t, r) {
        if (!_(t))
          throw new TypeError();
        if (d(r) || (r = O(r)), !_(t))
          throw new TypeError();
        d(r) || (r = O(r));
        var a = j(
          t,
          r,
          /*Create*/
          !1
        );
        return d(a) ? !1 : a.OrdinaryDeleteMetadata(e, t, r);
      }
      f("deleteMetadata", Ie);
      function Re(e, t) {
        for (var r = e.length - 1; r >= 0; --r) {
          var a = e[r], c = a(t);
          if (!d(c) && !k(c)) {
            if (!ne(c))
              throw new TypeError();
            t = c;
          }
        }
        return t;
      }
      function ke(e, t, r, a) {
        for (var c = e.length - 1; c >= 0; --c) {
          var g = e[c], m = g(t, r, a);
          if (!d(m) && !k(m)) {
            if (!_(m))
              throw new TypeError();
            a = m;
          }
        }
        return a;
      }
      function Z(e, t, r) {
        var a = U(e, t, r);
        if (a)
          return !0;
        var c = W(t);
        return k(c) ? !1 : Z(e, c, r);
      }
      function U(e, t, r) {
        var a = j(
          t,
          r,
          /*Create*/
          !1
        );
        return d(a) ? !1 : te(a.OrdinaryHasOwnMetadata(e, t, r));
      }
      function Q(e, t, r) {
        var a = U(e, t, r);
        if (a)
          return J(e, t, r);
        var c = W(t);
        if (!k(c))
          return Q(e, c, r);
      }
      function J(e, t, r) {
        var a = j(
          t,
          r,
          /*Create*/
          !1
        );
        if (!d(a))
          return a.OrdinaryGetOwnMetadata(e, t, r);
      }
      function X(e, t, r, a) {
        var c = j(
          r,
          a,
          /*Create*/
          !0
        );
        c.OrdinaryDefineOwnMetadata(e, t, r, a);
      }
      function Y(e, t) {
        var r = K(e, t), a = W(e);
        if (a === null)
          return r;
        var c = Y(a, t);
        if (c.length <= 0)
          return r;
        if (r.length <= 0)
          return c;
        for (var g = new G(), m = [], l = 0, i = r; l < i.length; l++) {
          var s = i[l], o = g.has(s);
          o || (g.add(s), m.push(s));
        }
        for (var u = 0, h = c; u < h.length; u++) {
          var s = h[u], o = g.has(s);
          o || (g.add(s), m.push(s));
        }
        return m;
      }
      function K(e, t) {
        var r = j(
          e,
          t,
          /*create*/
          !1
        );
        return r ? r.OrdinaryOwnMetadataKeys(e, t) : [];
      }
      function ee(e) {
        if (e === null)
          return 1;
        switch (typeof e) {
          case "undefined":
            return 0;
          case "boolean":
            return 2;
          case "string":
            return 3;
          case "symbol":
            return 4;
          case "number":
            return 5;
          case "object":
            return e === null ? 1 : 6;
          default:
            return 6;
        }
      }
      function d(e) {
        return e === void 0;
      }
      function k(e) {
        return e === null;
      }
      function xe(e) {
        return typeof e == "symbol";
      }
      function _(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      }
      function Se(e, t) {
        switch (ee(e)) {
          case 0:
            return e;
          case 1:
            return e;
          case 2:
            return e;
          case 3:
            return e;
          case 4:
            return e;
          case 5:
            return e;
        }
        var r = "string", a = ae(e, F);
        if (a !== void 0) {
          var c = a.call(e, r);
          if (_(c))
            throw new TypeError();
          return c;
        }
        return Ce(e);
      }
      function Ce(e, t) {
        var r, a;
        {
          var c = e.toString;
          if (D(c)) {
            var a = c.call(e);
            if (!_(a))
              return a;
          }
          var r = e.valueOf;
          if (D(r)) {
            var a = r.call(e);
            if (!_(a))
              return a;
          }
        }
        throw new TypeError();
      }
      function te(e) {
        return !!e;
      }
      function je(e) {
        return "" + e;
      }
      function O(e) {
        var t = Se(e);
        return xe(t) ? t : je(t);
      }
      function re(e) {
        return Array.isArray ? Array.isArray(e) : e instanceof Object ? e instanceof Array : Object.prototype.toString.call(e) === "[object Array]";
      }
      function D(e) {
        return typeof e == "function";
      }
      function ne(e) {
        return typeof e == "function";
      }
      function Ae(e) {
        switch (ee(e)) {
          case 3:
            return !0;
          case 4:
            return !0;
          default:
            return !1;
        }
      }
      function $(e, t) {
        return e === t || e !== e && t !== t;
      }
      function ae(e, t) {
        var r = e[t];
        if (r != null) {
          if (!D(r))
            throw new TypeError();
          return r;
        }
      }
      function ie(e) {
        var t = ae(e, P);
        if (!D(t))
          throw new TypeError();
        var r = t.call(e);
        if (!_(r))
          throw new TypeError();
        return r;
      }
      function se(e) {
        return e.value;
      }
      function oe(e) {
        var t = e.next();
        return t.done ? !1 : t;
      }
      function ue(e) {
        var t = e.return;
        t && t.call(e);
      }
      function W(e) {
        var t = Object.getPrototypeOf(e);
        if (typeof e != "function" || e === S || t !== S)
          return t;
        var r = e.prototype, a = r && Object.getPrototypeOf(r);
        if (a == null || a === Object.prototype)
          return t;
        var c = a.constructor;
        return typeof c != "function" || c === e ? t : c;
      }
      function qe() {
        var e;
        !d(R) && typeof p.Reflect < "u" && !(R in p.Reflect) && typeof p.Reflect.defineMetadata == "function" && (e = Ge(p.Reflect));
        var t, r, a, c = new H(), g = {
          registerProvider: m,
          getProvider: i,
          setProvider: o
        };
        return g;
        function m(u) {
          if (!Object.isExtensible(g))
            throw new Error("Cannot add provider to a frozen registry.");
          switch (!0) {
            case e === u:
              break;
            case d(t):
              t = u;
              break;
            case t === u:
              break;
            case d(r):
              r = u;
              break;
            case r === u:
              break;
            default:
              a === void 0 && (a = new G()), a.add(u);
              break;
          }
        }
        function l(u, h) {
          if (!d(t)) {
            if (t.isProviderFor(u, h))
              return t;
            if (!d(r)) {
              if (r.isProviderFor(u, h))
                return t;
              if (!d(a))
                for (var v = ie(a); ; ) {
                  var w = oe(v);
                  if (!w)
                    return;
                  var b = se(w);
                  if (b.isProviderFor(u, h))
                    return ue(v), b;
                }
            }
          }
          if (!d(e) && e.isProviderFor(u, h))
            return e;
        }
        function i(u, h) {
          var v = c.get(u), w;
          return d(v) || (w = v.get(h)), d(w) && (w = l(u, h), d(w) || (d(v) && (v = new C(), c.set(u, v)), v.set(h, w))), w;
        }
        function s(u) {
          if (d(u))
            throw new TypeError();
          return t === u || r === u || !d(a) && a.has(u);
        }
        function o(u, h, v) {
          if (!s(v))
            throw new Error("Metadata provider not registered.");
          var w = i(u, h);
          if (w !== v) {
            if (!d(w))
              return !1;
            var b = c.get(u);
            d(b) && (b = new C(), c.set(u, b)), b.set(h, v);
          }
          return !0;
        }
      }
      function De() {
        var e;
        return !d(R) && _(p.Reflect) && Object.isExtensible(p.Reflect) && (e = p.Reflect[R]), d(e) && (e = qe()), !d(R) && _(p.Reflect) && Object.isExtensible(p.Reflect) && Object.defineProperty(p.Reflect, R, {
          enumerable: !1,
          configurable: !1,
          writable: !1,
          value: e
        }), e;
      }
      function Fe(e) {
        var t = new H(), r = {
          isProviderFor: function(s, o) {
            var u = t.get(s);
            return d(u) ? !1 : u.has(o);
          },
          OrdinaryDefineOwnMetadata: m,
          OrdinaryHasOwnMetadata: c,
          OrdinaryGetOwnMetadata: g,
          OrdinaryOwnMetadataKeys: l,
          OrdinaryDeleteMetadata: i
        };
        return q.registerProvider(r), r;
        function a(s, o, u) {
          var h = t.get(s), v = !1;
          if (d(h)) {
            if (!u)
              return;
            h = new C(), t.set(s, h), v = !0;
          }
          var w = h.get(o);
          if (d(w)) {
            if (!u)
              return;
            if (w = new C(), h.set(o, w), !e.setProvider(s, o, r))
              throw h.delete(o), v && t.delete(s), new Error("Wrong provider for target.");
          }
          return w;
        }
        function c(s, o, u) {
          var h = a(
            o,
            u,
            /*Create*/
            !1
          );
          return d(h) ? !1 : te(h.has(s));
        }
        function g(s, o, u) {
          var h = a(
            o,
            u,
            /*Create*/
            !1
          );
          if (!d(h))
            return h.get(s);
        }
        function m(s, o, u, h) {
          var v = a(
            u,
            h,
            /*Create*/
            !0
          );
          v.set(s, o);
        }
        function l(s, o) {
          var u = [], h = a(
            s,
            o,
            /*Create*/
            !1
          );
          if (d(h))
            return u;
          for (var v = h.keys(), w = ie(v), b = 0; ; ) {
            var fe = oe(w);
            if (!fe)
              return u.length = b, u;
            var We = se(fe);
            try {
              u[b] = We;
            } catch (Le) {
              try {
                ue(w);
              } finally {
                throw Le;
              }
            }
            b++;
          }
        }
        function i(s, o, u) {
          var h = a(
            o,
            u,
            /*Create*/
            !1
          );
          if (d(h) || !h.delete(s))
            return !1;
          if (h.size === 0) {
            var v = t.get(o);
            d(v) || (v.delete(u), v.size === 0 && t.delete(v));
          }
          return !0;
        }
      }
      function Ge(e) {
        var t = e.defineMetadata, r = e.hasOwnMetadata, a = e.getOwnMetadata, c = e.getOwnMetadataKeys, g = e.deleteMetadata, m = new H(), l = {
          isProviderFor: function(i, s) {
            var o = m.get(i);
            return !d(o) && o.has(s) ? !0 : c(i, s).length ? (d(o) && (o = new G(), m.set(i, o)), o.add(s), !0) : !1;
          },
          OrdinaryDefineOwnMetadata: t,
          OrdinaryHasOwnMetadata: r,
          OrdinaryGetOwnMetadata: a,
          OrdinaryOwnMetadataKeys: c,
          OrdinaryDeleteMetadata: g
        };
        return l;
      }
      function j(e, t, r) {
        var a = q.getProvider(e, t);
        if (!d(a))
          return a;
        if (r) {
          if (q.setProvider(e, t, z))
            return z;
          throw new Error("Illegal state.");
        }
      }
      function He() {
        var e = {}, t = [], r = (
          /** @class */
          function() {
            function l(i, s, o) {
              this._index = 0, this._keys = i, this._values = s, this._selector = o;
            }
            return l.prototype["@@iterator"] = function() {
              return this;
            }, l.prototype[P] = function() {
              return this;
            }, l.prototype.next = function() {
              var i = this._index;
              if (i >= 0 && i < this._keys.length) {
                var s = this._selector(this._keys[i], this._values[i]);
                return i + 1 >= this._keys.length ? (this._index = -1, this._keys = t, this._values = t) : this._index++, { value: s, done: !1 };
              }
              return { value: void 0, done: !0 };
            }, l.prototype.throw = function(i) {
              throw this._index >= 0 && (this._index = -1, this._keys = t, this._values = t), i;
            }, l.prototype.return = function(i) {
              return this._index >= 0 && (this._index = -1, this._keys = t, this._values = t), { value: i, done: !0 };
            }, l;
          }()
        ), a = (
          /** @class */
          function() {
            function l() {
              this._keys = [], this._values = [], this._cacheKey = e, this._cacheIndex = -2;
            }
            return Object.defineProperty(l.prototype, "size", {
              get: function() {
                return this._keys.length;
              },
              enumerable: !0,
              configurable: !0
            }), l.prototype.has = function(i) {
              return this._find(
                i,
                /*insert*/
                !1
              ) >= 0;
            }, l.prototype.get = function(i) {
              var s = this._find(
                i,
                /*insert*/
                !1
              );
              return s >= 0 ? this._values[s] : void 0;
            }, l.prototype.set = function(i, s) {
              var o = this._find(
                i,
                /*insert*/
                !0
              );
              return this._values[o] = s, this;
            }, l.prototype.delete = function(i) {
              var s = this._find(
                i,
                /*insert*/
                !1
              );
              if (s >= 0) {
                for (var o = this._keys.length, u = s + 1; u < o; u++)
                  this._keys[u - 1] = this._keys[u], this._values[u - 1] = this._values[u];
                return this._keys.length--, this._values.length--, $(i, this._cacheKey) && (this._cacheKey = e, this._cacheIndex = -2), !0;
              }
              return !1;
            }, l.prototype.clear = function() {
              this._keys.length = 0, this._values.length = 0, this._cacheKey = e, this._cacheIndex = -2;
            }, l.prototype.keys = function() {
              return new r(this._keys, this._values, c);
            }, l.prototype.values = function() {
              return new r(this._keys, this._values, g);
            }, l.prototype.entries = function() {
              return new r(this._keys, this._values, m);
            }, l.prototype["@@iterator"] = function() {
              return this.entries();
            }, l.prototype[P] = function() {
              return this.entries();
            }, l.prototype._find = function(i, s) {
              if (!$(this._cacheKey, i)) {
                this._cacheIndex = -1;
                for (var o = 0; o < this._keys.length; o++)
                  if ($(this._keys[o], i)) {
                    this._cacheIndex = o;
                    break;
                  }
              }
              return this._cacheIndex < 0 && s && (this._cacheIndex = this._keys.length, this._keys.push(i), this._values.push(void 0)), this._cacheIndex;
            }, l;
          }()
        );
        return a;
        function c(l, i) {
          return l;
        }
        function g(l, i) {
          return i;
        }
        function m(l, i) {
          return [l, i];
        }
      }
      function Ue() {
        var e = (
          /** @class */
          function() {
            function t() {
              this._map = new C();
            }
            return Object.defineProperty(t.prototype, "size", {
              get: function() {
                return this._map.size;
              },
              enumerable: !0,
              configurable: !0
            }), t.prototype.has = function(r) {
              return this._map.has(r);
            }, t.prototype.add = function(r) {
              return this._map.set(r, r), this;
            }, t.prototype.delete = function(r) {
              return this._map.delete(r);
            }, t.prototype.clear = function() {
              this._map.clear();
            }, t.prototype.keys = function() {
              return this._map.keys();
            }, t.prototype.values = function() {
              return this._map.keys();
            }, t.prototype.entries = function() {
              return this._map.entries();
            }, t.prototype["@@iterator"] = function() {
              return this.keys();
            }, t.prototype[P] = function() {
              return this.keys();
            }, t;
          }()
        );
        return e;
      }
      function $e() {
        var e = 16, t = T.create(), r = a();
        return (
          /** @class */
          function() {
            function i() {
              this._key = a();
            }
            return i.prototype.has = function(s) {
              var o = c(
                s,
                /*create*/
                !1
              );
              return o !== void 0 ? T.has(o, this._key) : !1;
            }, i.prototype.get = function(s) {
              var o = c(
                s,
                /*create*/
                !1
              );
              return o !== void 0 ? T.get(o, this._key) : void 0;
            }, i.prototype.set = function(s, o) {
              var u = c(
                s,
                /*create*/
                !0
              );
              return u[this._key] = o, this;
            }, i.prototype.delete = function(s) {
              var o = c(
                s,
                /*create*/
                !1
              );
              return o !== void 0 ? delete o[this._key] : !1;
            }, i.prototype.clear = function() {
              this._key = a();
            }, i;
          }()
        );
        function a() {
          var i;
          do
            i = "@@WeakMap@@" + l();
          while (T.has(t, i));
          return t[i] = !0, i;
        }
        function c(i, s) {
          if (!M.call(i, r)) {
            if (!s)
              return;
            Object.defineProperty(i, r, { value: T.create() });
          }
          return i[r];
        }
        function g(i, s) {
          for (var o = 0; o < s; ++o)
            i[o] = Math.random() * 255 | 0;
          return i;
        }
        function m(i) {
          if (typeof Uint8Array == "function") {
            var s = new Uint8Array(i);
            return typeof crypto < "u" ? crypto.getRandomValues(s) : typeof msCrypto < "u" ? msCrypto.getRandomValues(s) : g(s, i), s;
          }
          return g(new Array(i), i);
        }
        function l() {
          var i = m(e);
          i[6] = i[6] & 79 | 64, i[8] = i[8] & 191 | 128;
          for (var s = "", o = 0; o < e; ++o) {
            var u = i[o];
            (o === 4 || o === 6 || o === 8) && (s += "-"), u < 16 && (s += "0"), s += u.toString(16).toLowerCase();
          }
          return s;
        }
      }
      function L(e) {
        return e.__ = void 0, delete e.__, e;
      }
    });
  }(y || (y = {})), de;
}
Be();
var Ve = Object.defineProperty, ze = (y, n, f) => n in y ? Ve(y, n, { enumerable: !0, configurable: !0, writable: !0, value: f }) : y[n] = f, V = (y, n, f) => ze(y, typeof n != "symbol" ? n + "" : n, f);
class B extends Error {
  constructor(n, f) {
    super("API Service Request Failed"), this.originalError = n, this.requestConfig = f, this.name = "ApiRequestError";
  }
}
const ve = class ye {
  constructor() {
    V(this, "axiosInstance"), V(this, "maxRetries");
  }
  static init(n) {
    return this.instance || (this.instance = new ye(), this.instance.maxRetries = n.maxRetries ?? 3, this.instance.axiosInstance = this.instance.createAxiosInstance(n), this.instance.setupInterceptors(), this.instance.configureRetry()), this.instance;
  }
  static getInstance() {
    if (!this.instance)
      throw new Error("Http not initialized. Call Http.init() first.");
    return this.instance;
  }
  getAxiosInstance() {
    return this.axiosInstance;
  }
  setAxiosInstance(n) {
    this.axiosInstance = n;
  }
  getFullBaseUrl(n) {
    return n.baseURL;
  }
  createAxiosInstance(n) {
    const f = {
      baseURL: this.getFullBaseUrl(n),
      timeout: n.timeout ?? 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...n.headers
      },
      withCredentials: n.withCredentials ?? !0
    };
    return Ne.create(f);
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (n) => n,
      (n) => Promise.reject(n)
    ), this.axiosInstance.interceptors.response.use(
      (n) => n,
      this.handleErrorResponse.bind(this)
    );
  }
  configureRetry() {
    N(this.axiosInstance, {
      retries: this.maxRetries,
      retryDelay: N.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(n) {
    var f;
    return N.isNetworkOrIdempotentRequestError(n) || ((f = n.response) == null ? void 0 : f.status) === 429;
  }
  handleErrorResponse(n) {
    return this.logError(n), Promise.reject(new B(n, n.config || {}));
  }
  logError(n) {
    var f, p, M, E;
    console.error("API Request Error", {
      url: (f = n.config) == null ? void 0 : f.url,
      method: (p = n.config) == null ? void 0 : p.method,
      status: (M = n.response) == null ? void 0 : M.status,
      data: (E = n.response) == null ? void 0 : E.data,
      message: n.message
    });
  }
  async request(n, f = {}) {
    try {
      const p = {
        timeout: 1e4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        ...n,
        ...f
      };
      return (await this.axiosInstance.request(
        p
      )).data;
    } catch (p) {
      throw p instanceof B ? p : new B(p, n);
    }
  }
  _setAxiosInstanceForTesting(n) {
    this.axiosInstance = n;
  }
};
V(ve, "instance");
let we = ve;
var Ze = Object.defineProperty, Qe = (y, n, f) => n in y ? Ze(y, n, { enumerable: !0, configurable: !0, writable: !0, value: f }) : y[n] = f, he = (y, n, f) => Qe(y, typeof n != "symbol" ? n + "" : n, f);
class et {
  constructor(n) {
    he(this, "http"), he(this, "pathname"), this.http = we.getInstance(), this.pathname = n;
  }
  mutate(n, f = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: n
      },
      f
    );
  }
  executeAction(n, f = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/actions/${n.action}`,
        data: n.params
      },
      f
    );
  }
  delete(n, f = {}) {
    return this.http.request(
      {
        method: "DELETE",
        url: this.pathname,
        data: n
      },
      f
    );
  }
  forceDelete(n, f = {}) {
    return this.http.request(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: n
      },
      f
    );
  }
  restore(n, f = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: n
      },
      f
    );
  }
}
var Je = Object.defineProperty, Xe = (y, n, f) => n in y ? Je(y, n, { enumerable: !0, configurable: !0, writable: !0, value: f }) : y[n] = f, pe = (y, n, f) => Xe(y, typeof n != "symbol" ? n + "" : n, f);
class tt {
  constructor(n) {
    pe(this, "http"), pe(this, "pathname"), this.http = we.getInstance(), this.pathname = n;
  }
  searchRequest(n, f = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/search`,
        data: { search: n }
      },
      f
    );
  }
  async search(n, f = {}) {
    return (await this.searchRequest(n, f)).data;
  }
  searchPaginate(n, f = {}) {
    return this.searchRequest(n, f);
  }
  getdetails(n = {}) {
    return this.http.request(
      {
        method: "GET",
        url: this.pathname
      },
      n
    );
  }
}
export {
  we as Http,
  et as Mutation,
  tt as Query
};

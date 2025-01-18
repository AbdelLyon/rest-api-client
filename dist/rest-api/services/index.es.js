import V from "axios-retry";
import We from "axios";
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
  var m;
  return function(a) {
    (function(d) {
      var v = typeof globalThis == "object" ? globalThis : typeof ce == "object" ? ce : typeof self == "object" ? self : typeof this == "object" ? this : A(), M = E(a);
      typeof v.Reflect < "u" && (M = E(v.Reflect, M)), d(M, v), typeof v.Reflect > "u" && (v.Reflect = a);
      function E(R, P) {
        return function(T, S) {
          Object.defineProperty(R, T, { configurable: !0, writable: !0, value: S }), P && P(T, S);
        };
      }
      function G() {
        try {
          return Function("return this;")();
        } catch {
        }
      }
      function k() {
        try {
          return (0, eval)("(function() { return this; })()");
        } catch {
        }
      }
      function A() {
        return G() || k();
      }
    })(function(d, v) {
      var M = Object.prototype.hasOwnProperty, E = typeof Symbol == "function", G = E && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", k = E && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", A = typeof Object.create == "function", R = { __proto__: [] } instanceof Array, P = !A && !R, T = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: A ? function() {
          return B(/* @__PURE__ */ Object.create(null));
        } : R ? function() {
          return B({ __proto__: null });
        } : function() {
          return B({});
        },
        has: P ? function(e, t) {
          return M.call(e, t);
        } : function(e, t) {
          return t in e;
        },
        get: P ? function(e, t) {
          return M.call(e, t) ? e[t] : void 0;
        } : function(e, t) {
          return e[t];
        }
      }, S = Object.getPrototypeOf(Function), j = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : Ge(), F = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : Fe(), U = typeof WeakMap == "function" ? WeakMap : Ue(), I = E ? Symbol.for("@reflect-metadata:registry") : void 0, q = Ae(), $ = qe(q);
      function pe(e, t, r, n) {
        if (c(r)) {
          if (!re(e))
            throw new TypeError();
          if (!ne(t))
            throw new TypeError();
          return ke(e, t);
        } else {
          if (!re(e))
            throw new TypeError();
          if (!w(t))
            throw new TypeError();
          if (!w(n) && !c(n) && !x(n))
            throw new TypeError();
          return x(n) && (n = void 0), r = O(r), Re(e, t, r, n);
        }
      }
      d("decorate", pe);
      function we(e, t) {
        function r(n, f) {
          if (!w(n))
            throw new TypeError();
          if (!c(f) && !je(f))
            throw new TypeError();
          X(e, t, n, f);
        }
        return r;
      }
      d("metadata", we);
      function _e(e, t, r, n) {
        if (!w(r))
          throw new TypeError();
        return c(n) || (n = O(n)), X(e, t, r, n);
      }
      d("defineMetadata", _e);
      function ge(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return c(r) || (r = O(r)), Z(e, t, r);
      }
      d("hasMetadata", ge);
      function me(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return c(r) || (r = O(r)), H(e, t, r);
      }
      d("hasOwnMetadata", me);
      function Me(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return c(r) || (r = O(r)), Q(e, t, r);
      }
      d("getMetadata", Me);
      function be(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return c(r) || (r = O(r)), J(e, t, r);
      }
      d("getOwnMetadata", be);
      function Oe(e, t) {
        if (!w(e))
          throw new TypeError();
        return c(t) || (t = O(t)), Y(e, t);
      }
      d("getMetadataKeys", Oe);
      function Ee(e, t) {
        if (!w(e))
          throw new TypeError();
        return c(t) || (t = O(t)), K(e, t);
      }
      d("getOwnMetadataKeys", Ee);
      function Te(e, t, r) {
        if (!w(t))
          throw new TypeError();
        if (c(r) || (r = O(r)), !w(t))
          throw new TypeError();
        c(r) || (r = O(r));
        var n = C(
          t,
          r,
          /*Create*/
          !1
        );
        return c(n) ? !1 : n.OrdinaryDeleteMetadata(e, t, r);
      }
      d("deleteMetadata", Te);
      function ke(e, t) {
        for (var r = e.length - 1; r >= 0; --r) {
          var n = e[r], f = n(t);
          if (!c(f) && !x(f)) {
            if (!ne(f))
              throw new TypeError();
            t = f;
          }
        }
        return t;
      }
      function Re(e, t, r, n) {
        for (var f = e.length - 1; f >= 0; --f) {
          var g = e[f], _ = g(t, r, n);
          if (!c(_) && !x(_)) {
            if (!w(_))
              throw new TypeError();
            n = _;
          }
        }
        return n;
      }
      function Z(e, t, r) {
        var n = H(e, t, r);
        if (n)
          return !0;
        var f = W(t);
        return x(f) ? !1 : Z(e, f, r);
      }
      function H(e, t, r) {
        var n = C(
          t,
          r,
          /*Create*/
          !1
        );
        return c(n) ? !1 : te(n.OrdinaryHasOwnMetadata(e, t, r));
      }
      function Q(e, t, r) {
        var n = H(e, t, r);
        if (n)
          return J(e, t, r);
        var f = W(t);
        if (!x(f))
          return Q(e, f, r);
      }
      function J(e, t, r) {
        var n = C(
          t,
          r,
          /*Create*/
          !1
        );
        if (!c(n))
          return n.OrdinaryGetOwnMetadata(e, t, r);
      }
      function X(e, t, r, n) {
        var f = C(
          r,
          n,
          /*Create*/
          !0
        );
        f.OrdinaryDefineOwnMetadata(e, t, r, n);
      }
      function Y(e, t) {
        var r = K(e, t), n = W(e);
        if (n === null)
          return r;
        var f = Y(n, t);
        if (f.length <= 0)
          return r;
        if (r.length <= 0)
          return f;
        for (var g = new F(), _ = [], l = 0, i = r; l < i.length; l++) {
          var s = i[l], o = g.has(s);
          o || (g.add(s), _.push(s));
        }
        for (var u = 0, h = f; u < h.length; u++) {
          var s = h[u], o = g.has(s);
          o || (g.add(s), _.push(s));
        }
        return _;
      }
      function K(e, t) {
        var r = C(
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
      function c(e) {
        return e === void 0;
      }
      function x(e) {
        return e === null;
      }
      function Ie(e) {
        return typeof e == "symbol";
      }
      function w(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      }
      function xe(e, t) {
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
        var r = "string", n = ae(e, G);
        if (n !== void 0) {
          var f = n.call(e, r);
          if (w(f))
            throw new TypeError();
          return f;
        }
        return Pe(e);
      }
      function Pe(e, t) {
        var r, n;
        {
          var f = e.toString;
          if (D(f)) {
            var n = f.call(e);
            if (!w(n))
              return n;
          }
          var r = e.valueOf;
          if (D(r)) {
            var n = r.call(e);
            if (!w(n))
              return n;
          }
        }
        throw new TypeError();
      }
      function te(e) {
        return !!e;
      }
      function Se(e) {
        return "" + e;
      }
      function O(e) {
        var t = xe(e);
        return Ie(t) ? t : Se(t);
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
      function je(e) {
        switch (ee(e)) {
          case 3:
            return !0;
          case 4:
            return !0;
          default:
            return !1;
        }
      }
      function L(e, t) {
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
        var t = ae(e, k);
        if (!D(t))
          throw new TypeError();
        var r = t.call(e);
        if (!w(r))
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
        var r = e.prototype, n = r && Object.getPrototypeOf(r);
        if (n == null || n === Object.prototype)
          return t;
        var f = n.constructor;
        return typeof f != "function" || f === e ? t : f;
      }
      function Ce() {
        var e;
        !c(I) && typeof v.Reflect < "u" && !(I in v.Reflect) && typeof v.Reflect.defineMetadata == "function" && (e = De(v.Reflect));
        var t, r, n, f = new U(), g = {
          registerProvider: _,
          getProvider: i,
          setProvider: o
        };
        return g;
        function _(u) {
          if (!Object.isExtensible(g))
            throw new Error("Cannot add provider to a frozen registry.");
          switch (!0) {
            case e === u:
              break;
            case c(t):
              t = u;
              break;
            case t === u:
              break;
            case c(r):
              r = u;
              break;
            case r === u:
              break;
            default:
              n === void 0 && (n = new F()), n.add(u);
              break;
          }
        }
        function l(u, h) {
          if (!c(t)) {
            if (t.isProviderFor(u, h))
              return t;
            if (!c(r)) {
              if (r.isProviderFor(u, h))
                return t;
              if (!c(n))
                for (var y = ie(n); ; ) {
                  var p = oe(y);
                  if (!p)
                    return;
                  var b = se(p);
                  if (b.isProviderFor(u, h))
                    return ue(y), b;
                }
            }
          }
          if (!c(e) && e.isProviderFor(u, h))
            return e;
        }
        function i(u, h) {
          var y = f.get(u), p;
          return c(y) || (p = y.get(h)), c(p) && (p = l(u, h), c(p) || (c(y) && (y = new j(), f.set(u, y)), y.set(h, p))), p;
        }
        function s(u) {
          if (c(u))
            throw new TypeError();
          return t === u || r === u || !c(n) && n.has(u);
        }
        function o(u, h, y) {
          if (!s(y))
            throw new Error("Metadata provider not registered.");
          var p = i(u, h);
          if (p !== y) {
            if (!c(p))
              return !1;
            var b = f.get(u);
            c(b) && (b = new j(), f.set(u, b)), b.set(h, y);
          }
          return !0;
        }
      }
      function Ae() {
        var e;
        return !c(I) && w(v.Reflect) && Object.isExtensible(v.Reflect) && (e = v.Reflect[I]), c(e) && (e = Ce()), !c(I) && w(v.Reflect) && Object.isExtensible(v.Reflect) && Object.defineProperty(v.Reflect, I, {
          enumerable: !1,
          configurable: !1,
          writable: !1,
          value: e
        }), e;
      }
      function qe(e) {
        var t = new U(), r = {
          isProviderFor: function(s, o) {
            var u = t.get(s);
            return c(u) ? !1 : u.has(o);
          },
          OrdinaryDefineOwnMetadata: _,
          OrdinaryHasOwnMetadata: f,
          OrdinaryGetOwnMetadata: g,
          OrdinaryOwnMetadataKeys: l,
          OrdinaryDeleteMetadata: i
        };
        return q.registerProvider(r), r;
        function n(s, o, u) {
          var h = t.get(s), y = !1;
          if (c(h)) {
            if (!u)
              return;
            h = new j(), t.set(s, h), y = !0;
          }
          var p = h.get(o);
          if (c(p)) {
            if (!u)
              return;
            if (p = new j(), h.set(o, p), !e.setProvider(s, o, r))
              throw h.delete(o), y && t.delete(s), new Error("Wrong provider for target.");
          }
          return p;
        }
        function f(s, o, u) {
          var h = n(
            o,
            u,
            /*Create*/
            !1
          );
          return c(h) ? !1 : te(h.has(s));
        }
        function g(s, o, u) {
          var h = n(
            o,
            u,
            /*Create*/
            !1
          );
          if (!c(h))
            return h.get(s);
        }
        function _(s, o, u, h) {
          var y = n(
            u,
            h,
            /*Create*/
            !0
          );
          y.set(s, o);
        }
        function l(s, o) {
          var u = [], h = n(
            s,
            o,
            /*Create*/
            !1
          );
          if (c(h))
            return u;
          for (var y = h.keys(), p = ie(y), b = 0; ; ) {
            var fe = oe(p);
            if (!fe)
              return u.length = b, u;
            var He = se(fe);
            try {
              u[b] = He;
            } catch (Le) {
              try {
                ue(p);
              } finally {
                throw Le;
              }
            }
            b++;
          }
        }
        function i(s, o, u) {
          var h = n(
            o,
            u,
            /*Create*/
            !1
          );
          if (c(h) || !h.delete(s))
            return !1;
          if (h.size === 0) {
            var y = t.get(o);
            c(y) || (y.delete(u), y.size === 0 && t.delete(y));
          }
          return !0;
        }
      }
      function De(e) {
        var t = e.defineMetadata, r = e.hasOwnMetadata, n = e.getOwnMetadata, f = e.getOwnMetadataKeys, g = e.deleteMetadata, _ = new U(), l = {
          isProviderFor: function(i, s) {
            var o = _.get(i);
            return !c(o) && o.has(s) ? !0 : f(i, s).length ? (c(o) && (o = new F(), _.set(i, o)), o.add(s), !0) : !1;
          },
          OrdinaryDefineOwnMetadata: t,
          OrdinaryHasOwnMetadata: r,
          OrdinaryGetOwnMetadata: n,
          OrdinaryOwnMetadataKeys: f,
          OrdinaryDeleteMetadata: g
        };
        return l;
      }
      function C(e, t, r) {
        var n = q.getProvider(e, t);
        if (!c(n))
          return n;
        if (r) {
          if (q.setProvider(e, t, $))
            return $;
          throw new Error("Illegal state.");
        }
      }
      function Ge() {
        var e = {}, t = [], r = (
          /** @class */
          function() {
            function l(i, s, o) {
              this._index = 0, this._keys = i, this._values = s, this._selector = o;
            }
            return l.prototype["@@iterator"] = function() {
              return this;
            }, l.prototype[k] = function() {
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
        ), n = (
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
                return this._keys.length--, this._values.length--, L(i, this._cacheKey) && (this._cacheKey = e, this._cacheIndex = -2), !0;
              }
              return !1;
            }, l.prototype.clear = function() {
              this._keys.length = 0, this._values.length = 0, this._cacheKey = e, this._cacheIndex = -2;
            }, l.prototype.keys = function() {
              return new r(this._keys, this._values, f);
            }, l.prototype.values = function() {
              return new r(this._keys, this._values, g);
            }, l.prototype.entries = function() {
              return new r(this._keys, this._values, _);
            }, l.prototype["@@iterator"] = function() {
              return this.entries();
            }, l.prototype[k] = function() {
              return this.entries();
            }, l.prototype._find = function(i, s) {
              if (!L(this._cacheKey, i)) {
                this._cacheIndex = -1;
                for (var o = 0; o < this._keys.length; o++)
                  if (L(this._keys[o], i)) {
                    this._cacheIndex = o;
                    break;
                  }
              }
              return this._cacheIndex < 0 && s && (this._cacheIndex = this._keys.length, this._keys.push(i), this._values.push(void 0)), this._cacheIndex;
            }, l;
          }()
        );
        return n;
        function f(l, i) {
          return l;
        }
        function g(l, i) {
          return i;
        }
        function _(l, i) {
          return [l, i];
        }
      }
      function Fe() {
        var e = (
          /** @class */
          function() {
            function t() {
              this._map = new j();
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
            }, t.prototype[k] = function() {
              return this.keys();
            }, t;
          }()
        );
        return e;
      }
      function Ue() {
        var e = 16, t = T.create(), r = n();
        return (
          /** @class */
          function() {
            function i() {
              this._key = n();
            }
            return i.prototype.has = function(s) {
              var o = f(
                s,
                /*create*/
                !1
              );
              return o !== void 0 ? T.has(o, this._key) : !1;
            }, i.prototype.get = function(s) {
              var o = f(
                s,
                /*create*/
                !1
              );
              return o !== void 0 ? T.get(o, this._key) : void 0;
            }, i.prototype.set = function(s, o) {
              var u = f(
                s,
                /*create*/
                !0
              );
              return u[this._key] = o, this;
            }, i.prototype.delete = function(s) {
              var o = f(
                s,
                /*create*/
                !1
              );
              return o !== void 0 ? delete o[this._key] : !1;
            }, i.prototype.clear = function() {
              this._key = n();
            }, i;
          }()
        );
        function n() {
          var i;
          do
            i = "@@WeakMap@@" + l();
          while (T.has(t, i));
          return t[i] = !0, i;
        }
        function f(i, s) {
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
        function _(i) {
          if (typeof Uint8Array == "function") {
            var s = new Uint8Array(i);
            return typeof crypto < "u" ? crypto.getRandomValues(s) : typeof msCrypto < "u" ? msCrypto.getRandomValues(s) : g(s, i), s;
          }
          return g(new Array(i), i);
        }
        function l() {
          var i = _(e);
          i[6] = i[6] & 79 | 64, i[8] = i[8] & 191 | 128;
          for (var s = "", o = 0; o < e; ++o) {
            var u = i[o];
            (o === 4 || o === 6 || o === 8) && (s += "-"), u < 16 && (s += "0"), s += u.toString(16).toLowerCase();
          }
          return s;
        }
      }
      function B(e) {
        return e.__ = void 0, delete e.__, e;
      }
    });
  }(m || (m = {})), de;
}
Be();
var Ve = Object.defineProperty, ze = (m, a, d) => a in m ? Ve(m, a, { enumerable: !0, configurable: !0, writable: !0, value: d }) : m[a] = d, N = (m, a, d) => ze(m, typeof a != "symbol" ? a + "" : a, d);
class z extends Error {
  constructor(a, d) {
    super("API Service Request Failed"), this.originalError = a, this.requestConfig = d, this.name = "ApiRequestError";
  }
}
const he = class ve {
  constructor(a) {
    N(this, "axiosInstance"), N(this, "maxRetries"), this.maxRetries = a.maxRetries ?? 3, this.axiosInstance = this.createAxiosInstance(a), this.setupInterceptors(), this.configureRetry();
  }
  static init(a) {
    return this.instance !== void 0 && (this.instance = new ve(a)), this.instance;
  }
  static getInstance() {
    if (this.instance !== void 0)
      throw new Error("Http not initialized. Call Http.init() first.");
    return this.instance;
  }
  getAxiosInstance() {
    return this.axiosInstance;
  }
  setAxiosInstance(a) {
    this.axiosInstance = a;
  }
  getFullBaseUrl(a) {
    return a.baseURL;
  }
  createAxiosInstance(a) {
    const d = {
      baseURL: this.getFullBaseUrl(a),
      timeout: a.timeout ?? 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...a.headers
      },
      withCredentials: a.withCredentials ?? !0
    };
    return We.create(d);
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (a) => a,
      (a) => Promise.reject(a)
    ), this.axiosInstance.interceptors.response.use(
      (a) => a,
      this.handleErrorResponse.bind(this)
    );
  }
  configureRetry() {
    V(this.axiosInstance, {
      retries: this.maxRetries,
      retryDelay: V.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(a) {
    var d;
    return V.isNetworkOrIdempotentRequestError(a) || ((d = a.response) == null ? void 0 : d.status) === 429;
  }
  handleErrorResponse(a) {
    return this.logError(a), Promise.reject(new z(a, a.config || {}));
  }
  logError(a) {
    var d, v, M, E;
    console.error("API Request Error", {
      url: (d = a.config) == null ? void 0 : d.url,
      method: (v = a.config) == null ? void 0 : v.method,
      status: (M = a.response) == null ? void 0 : M.status,
      data: (E = a.response) == null ? void 0 : E.data,
      message: a.message
    });
  }
  async request(a, d = {}) {
    try {
      const v = {
        timeout: 1e4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        ...a,
        ...d
      };
      return (await this.axiosInstance.request(
        v
      )).data;
    } catch (v) {
      throw v instanceof z ? v : new z(v, a);
    }
  }
  // Méthode pour les tests
  _setAxiosInstanceForTesting(a) {
    this.axiosInstance = a;
  }
};
N(he, "instance");
let ye = he;
class Ze extends ye {
  constructor(a) {
    super({
      baseURL: `/${a}`
    });
  }
  mutate(a, d = {}) {
    return this.request(
      {
        method: "POST",
        url: "/mutate",
        data: a
      },
      d
    );
  }
  executeAction(a, d = {}) {
    return this.request(
      {
        method: "POST",
        url: `/actions/${a.action}`,
        data: a.params
      },
      d
    );
  }
  delete(a, d = {}) {
    return this.request(
      {
        method: "DELETE",
        url: "",
        data: a
      },
      d
    );
  }
  forceDelete(a, d = {}) {
    return this.request(
      {
        method: "DELETE",
        url: "/force",
        data: a
      },
      d
    );
  }
  restore(a, d = {}) {
    return this.request(
      {
        method: "POST",
        url: "/restore",
        data: a
      },
      d
    );
  }
}
class Qe extends ye {
  constructor(a) {
    super({
      baseURL: `/${a}`
    });
  }
  searchRequest(a, d = {}) {
    return this.request(
      {
        method: "POST",
        url: "/search",
        data: { search: a }
      },
      d
    );
  }
  async search(a, d = {}) {
    return (await this.searchRequest(a, d)).data;
  }
  searchPaginate(a, d = {}) {
    return this.searchRequest(a, d);
  }
  getdetails(a = {}) {
    return this.request(
      {
        method: "GET",
        url: ""
      },
      a
    );
  }
}
export {
  ye as Http,
  Ze as Mutation,
  Qe as Query
};

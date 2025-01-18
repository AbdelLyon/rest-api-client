import B from "axios-retry";
import $e from "axios";
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
function Le() {
  if (le) return de;
  le = 1;
  var m;
  return function(i) {
    (function(c) {
      var l = typeof globalThis == "object" ? globalThis : typeof ce == "object" ? ce : typeof self == "object" ? self : typeof this == "object" ? this : A(), M = E(i);
      typeof l.Reflect < "u" && (M = E(l.Reflect, M)), c(M, l), typeof l.Reflect > "u" && (l.Reflect = i);
      function E(I, P) {
        return function(T, S) {
          Object.defineProperty(I, T, { configurable: !0, writable: !0, value: S }), P && P(T, S);
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
    })(function(c, l) {
      var M = Object.prototype.hasOwnProperty, E = typeof Symbol == "function", G = E && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", k = E && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", A = typeof Object.create == "function", I = { __proto__: [] } instanceof Array, P = !A && !I, T = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: A ? function() {
          return L(/* @__PURE__ */ Object.create(null));
        } : I ? function() {
          return L({ __proto__: null });
        } : function() {
          return L({});
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
      }, S = Object.getPrototypeOf(Function), j = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : Ge(), F = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : Fe(), H = typeof WeakMap == "function" ? WeakMap : He(), R = E ? Symbol.for("@reflect-metadata:registry") : void 0, q = Ae(), N = qe(q);
      function pe(e, t, r, n) {
        if (d(r)) {
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
          if (!w(n) && !d(n) && !x(n))
            throw new TypeError();
          return x(n) && (n = void 0), r = O(r), Ie(e, t, r, n);
        }
      }
      c("decorate", pe);
      function we(e, t) {
        function r(n, f) {
          if (!w(n))
            throw new TypeError();
          if (!d(f) && !je(f))
            throw new TypeError();
          X(e, t, n, f);
        }
        return r;
      }
      c("metadata", we);
      function _e(e, t, r, n) {
        if (!w(r))
          throw new TypeError();
        return d(n) || (n = O(n)), X(e, t, r, n);
      }
      c("defineMetadata", _e);
      function ge(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return d(r) || (r = O(r)), Z(e, t, r);
      }
      c("hasMetadata", ge);
      function me(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return d(r) || (r = O(r)), U(e, t, r);
      }
      c("hasOwnMetadata", me);
      function Me(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return d(r) || (r = O(r)), Q(e, t, r);
      }
      c("getMetadata", Me);
      function be(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return d(r) || (r = O(r)), J(e, t, r);
      }
      c("getOwnMetadata", be);
      function Oe(e, t) {
        if (!w(e))
          throw new TypeError();
        return d(t) || (t = O(t)), Y(e, t);
      }
      c("getMetadataKeys", Oe);
      function Ee(e, t) {
        if (!w(e))
          throw new TypeError();
        return d(t) || (t = O(t)), K(e, t);
      }
      c("getOwnMetadataKeys", Ee);
      function Te(e, t, r) {
        if (!w(t))
          throw new TypeError();
        if (d(r) || (r = O(r)), !w(t))
          throw new TypeError();
        d(r) || (r = O(r));
        var n = C(
          t,
          r,
          /*Create*/
          !1
        );
        return d(n) ? !1 : n.OrdinaryDeleteMetadata(e, t, r);
      }
      c("deleteMetadata", Te);
      function ke(e, t) {
        for (var r = e.length - 1; r >= 0; --r) {
          var n = e[r], f = n(t);
          if (!d(f) && !x(f)) {
            if (!ne(f))
              throw new TypeError();
            t = f;
          }
        }
        return t;
      }
      function Ie(e, t, r, n) {
        for (var f = e.length - 1; f >= 0; --f) {
          var g = e[f], _ = g(t, r, n);
          if (!d(_) && !x(_)) {
            if (!w(_))
              throw new TypeError();
            n = _;
          }
        }
        return n;
      }
      function Z(e, t, r) {
        var n = U(e, t, r);
        if (n)
          return !0;
        var f = $(t);
        return x(f) ? !1 : Z(e, f, r);
      }
      function U(e, t, r) {
        var n = C(
          t,
          r,
          /*Create*/
          !1
        );
        return d(n) ? !1 : te(n.OrdinaryHasOwnMetadata(e, t, r));
      }
      function Q(e, t, r) {
        var n = U(e, t, r);
        if (n)
          return J(e, t, r);
        var f = $(t);
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
        if (!d(n))
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
        var r = K(e, t), n = $(e);
        if (n === null)
          return r;
        var f = Y(n, t);
        if (f.length <= 0)
          return r;
        if (r.length <= 0)
          return f;
        for (var g = new F(), _ = [], h = 0, a = r; h < a.length; h++) {
          var s = a[h], o = g.has(s);
          o || (g.add(s), _.push(s));
        }
        for (var u = 0, v = f; u < v.length; u++) {
          var s = v[u], o = g.has(s);
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
      function d(e) {
        return e === void 0;
      }
      function x(e) {
        return e === null;
      }
      function Re(e) {
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
        return Re(t) ? t : Se(t);
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
      function W(e, t) {
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
      function $(e) {
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
        !d(R) && typeof l.Reflect < "u" && !(R in l.Reflect) && typeof l.Reflect.defineMetadata == "function" && (e = De(l.Reflect));
        var t, r, n, f = new H(), g = {
          registerProvider: _,
          getProvider: a,
          setProvider: o
        };
        return g;
        function _(u) {
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
              n === void 0 && (n = new F()), n.add(u);
              break;
          }
        }
        function h(u, v) {
          if (!d(t)) {
            if (t.isProviderFor(u, v))
              return t;
            if (!d(r)) {
              if (r.isProviderFor(u, v))
                return t;
              if (!d(n))
                for (var y = ie(n); ; ) {
                  var p = oe(y);
                  if (!p)
                    return;
                  var b = se(p);
                  if (b.isProviderFor(u, v))
                    return ue(y), b;
                }
            }
          }
          if (!d(e) && e.isProviderFor(u, v))
            return e;
        }
        function a(u, v) {
          var y = f.get(u), p;
          return d(y) || (p = y.get(v)), d(p) && (p = h(u, v), d(p) || (d(y) && (y = new j(), f.set(u, y)), y.set(v, p))), p;
        }
        function s(u) {
          if (d(u))
            throw new TypeError();
          return t === u || r === u || !d(n) && n.has(u);
        }
        function o(u, v, y) {
          if (!s(y))
            throw new Error("Metadata provider not registered.");
          var p = a(u, v);
          if (p !== y) {
            if (!d(p))
              return !1;
            var b = f.get(u);
            d(b) && (b = new j(), f.set(u, b)), b.set(v, y);
          }
          return !0;
        }
      }
      function Ae() {
        var e;
        return !d(R) && w(l.Reflect) && Object.isExtensible(l.Reflect) && (e = l.Reflect[R]), d(e) && (e = Ce()), !d(R) && w(l.Reflect) && Object.isExtensible(l.Reflect) && Object.defineProperty(l.Reflect, R, {
          enumerable: !1,
          configurable: !1,
          writable: !1,
          value: e
        }), e;
      }
      function qe(e) {
        var t = new H(), r = {
          isProviderFor: function(s, o) {
            var u = t.get(s);
            return d(u) ? !1 : u.has(o);
          },
          OrdinaryDefineOwnMetadata: _,
          OrdinaryHasOwnMetadata: f,
          OrdinaryGetOwnMetadata: g,
          OrdinaryOwnMetadataKeys: h,
          OrdinaryDeleteMetadata: a
        };
        return q.registerProvider(r), r;
        function n(s, o, u) {
          var v = t.get(s), y = !1;
          if (d(v)) {
            if (!u)
              return;
            v = new j(), t.set(s, v), y = !0;
          }
          var p = v.get(o);
          if (d(p)) {
            if (!u)
              return;
            if (p = new j(), v.set(o, p), !e.setProvider(s, o, r))
              throw v.delete(o), y && t.delete(s), new Error("Wrong provider for target.");
          }
          return p;
        }
        function f(s, o, u) {
          var v = n(
            o,
            u,
            /*Create*/
            !1
          );
          return d(v) ? !1 : te(v.has(s));
        }
        function g(s, o, u) {
          var v = n(
            o,
            u,
            /*Create*/
            !1
          );
          if (!d(v))
            return v.get(s);
        }
        function _(s, o, u, v) {
          var y = n(
            u,
            v,
            /*Create*/
            !0
          );
          y.set(s, o);
        }
        function h(s, o) {
          var u = [], v = n(
            s,
            o,
            /*Create*/
            !1
          );
          if (d(v))
            return u;
          for (var y = v.keys(), p = ie(y), b = 0; ; ) {
            var fe = oe(p);
            if (!fe)
              return u.length = b, u;
            var Ue = se(fe);
            try {
              u[b] = Ue;
            } catch (We) {
              try {
                ue(p);
              } finally {
                throw We;
              }
            }
            b++;
          }
        }
        function a(s, o, u) {
          var v = n(
            o,
            u,
            /*Create*/
            !1
          );
          if (d(v) || !v.delete(s))
            return !1;
          if (v.size === 0) {
            var y = t.get(o);
            d(y) || (y.delete(u), y.size === 0 && t.delete(y));
          }
          return !0;
        }
      }
      function De(e) {
        var t = e.defineMetadata, r = e.hasOwnMetadata, n = e.getOwnMetadata, f = e.getOwnMetadataKeys, g = e.deleteMetadata, _ = new H(), h = {
          isProviderFor: function(a, s) {
            var o = _.get(a);
            return !d(o) && o.has(s) ? !0 : f(a, s).length ? (d(o) && (o = new F(), _.set(a, o)), o.add(s), !0) : !1;
          },
          OrdinaryDefineOwnMetadata: t,
          OrdinaryHasOwnMetadata: r,
          OrdinaryGetOwnMetadata: n,
          OrdinaryOwnMetadataKeys: f,
          OrdinaryDeleteMetadata: g
        };
        return h;
      }
      function C(e, t, r) {
        var n = q.getProvider(e, t);
        if (!d(n))
          return n;
        if (r) {
          if (q.setProvider(e, t, N))
            return N;
          throw new Error("Illegal state.");
        }
      }
      function Ge() {
        var e = {}, t = [], r = (
          /** @class */
          function() {
            function h(a, s, o) {
              this._index = 0, this._keys = a, this._values = s, this._selector = o;
            }
            return h.prototype["@@iterator"] = function() {
              return this;
            }, h.prototype[k] = function() {
              return this;
            }, h.prototype.next = function() {
              var a = this._index;
              if (a >= 0 && a < this._keys.length) {
                var s = this._selector(this._keys[a], this._values[a]);
                return a + 1 >= this._keys.length ? (this._index = -1, this._keys = t, this._values = t) : this._index++, { value: s, done: !1 };
              }
              return { value: void 0, done: !0 };
            }, h.prototype.throw = function(a) {
              throw this._index >= 0 && (this._index = -1, this._keys = t, this._values = t), a;
            }, h.prototype.return = function(a) {
              return this._index >= 0 && (this._index = -1, this._keys = t, this._values = t), { value: a, done: !0 };
            }, h;
          }()
        ), n = (
          /** @class */
          function() {
            function h() {
              this._keys = [], this._values = [], this._cacheKey = e, this._cacheIndex = -2;
            }
            return Object.defineProperty(h.prototype, "size", {
              get: function() {
                return this._keys.length;
              },
              enumerable: !0,
              configurable: !0
            }), h.prototype.has = function(a) {
              return this._find(
                a,
                /*insert*/
                !1
              ) >= 0;
            }, h.prototype.get = function(a) {
              var s = this._find(
                a,
                /*insert*/
                !1
              );
              return s >= 0 ? this._values[s] : void 0;
            }, h.prototype.set = function(a, s) {
              var o = this._find(
                a,
                /*insert*/
                !0
              );
              return this._values[o] = s, this;
            }, h.prototype.delete = function(a) {
              var s = this._find(
                a,
                /*insert*/
                !1
              );
              if (s >= 0) {
                for (var o = this._keys.length, u = s + 1; u < o; u++)
                  this._keys[u - 1] = this._keys[u], this._values[u - 1] = this._values[u];
                return this._keys.length--, this._values.length--, W(a, this._cacheKey) && (this._cacheKey = e, this._cacheIndex = -2), !0;
              }
              return !1;
            }, h.prototype.clear = function() {
              this._keys.length = 0, this._values.length = 0, this._cacheKey = e, this._cacheIndex = -2;
            }, h.prototype.keys = function() {
              return new r(this._keys, this._values, f);
            }, h.prototype.values = function() {
              return new r(this._keys, this._values, g);
            }, h.prototype.entries = function() {
              return new r(this._keys, this._values, _);
            }, h.prototype["@@iterator"] = function() {
              return this.entries();
            }, h.prototype[k] = function() {
              return this.entries();
            }, h.prototype._find = function(a, s) {
              if (!W(this._cacheKey, a)) {
                this._cacheIndex = -1;
                for (var o = 0; o < this._keys.length; o++)
                  if (W(this._keys[o], a)) {
                    this._cacheIndex = o;
                    break;
                  }
              }
              return this._cacheIndex < 0 && s && (this._cacheIndex = this._keys.length, this._keys.push(a), this._values.push(void 0)), this._cacheIndex;
            }, h;
          }()
        );
        return n;
        function f(h, a) {
          return h;
        }
        function g(h, a) {
          return a;
        }
        function _(h, a) {
          return [h, a];
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
      function He() {
        var e = 16, t = T.create(), r = n();
        return (
          /** @class */
          function() {
            function a() {
              this._key = n();
            }
            return a.prototype.has = function(s) {
              var o = f(
                s,
                /*create*/
                !1
              );
              return o !== void 0 ? T.has(o, this._key) : !1;
            }, a.prototype.get = function(s) {
              var o = f(
                s,
                /*create*/
                !1
              );
              return o !== void 0 ? T.get(o, this._key) : void 0;
            }, a.prototype.set = function(s, o) {
              var u = f(
                s,
                /*create*/
                !0
              );
              return u[this._key] = o, this;
            }, a.prototype.delete = function(s) {
              var o = f(
                s,
                /*create*/
                !1
              );
              return o !== void 0 ? delete o[this._key] : !1;
            }, a.prototype.clear = function() {
              this._key = n();
            }, a;
          }()
        );
        function n() {
          var a;
          do
            a = "@@WeakMap@@" + h();
          while (T.has(t, a));
          return t[a] = !0, a;
        }
        function f(a, s) {
          if (!M.call(a, r)) {
            if (!s)
              return;
            Object.defineProperty(a, r, { value: T.create() });
          }
          return a[r];
        }
        function g(a, s) {
          for (var o = 0; o < s; ++o)
            a[o] = Math.random() * 255 | 0;
          return a;
        }
        function _(a) {
          if (typeof Uint8Array == "function") {
            var s = new Uint8Array(a);
            return typeof crypto < "u" ? crypto.getRandomValues(s) : typeof msCrypto < "u" ? msCrypto.getRandomValues(s) : g(s, a), s;
          }
          return g(new Array(a), a);
        }
        function h() {
          var a = _(e);
          a[6] = a[6] & 79 | 64, a[8] = a[8] & 191 | 128;
          for (var s = "", o = 0; o < e; ++o) {
            var u = a[o];
            (o === 4 || o === 6 || o === 8) && (s += "-"), u < 16 && (s += "0"), s += u.toString(16).toLowerCase();
          }
          return s;
        }
      }
      function L(e) {
        return e.__ = void 0, delete e.__, e;
      }
    });
  }(m || (m = {})), de;
}
Le();
var Be = Object.defineProperty, Ve = (m, i, c) => i in m ? Be(m, i, { enumerable: !0, configurable: !0, writable: !0, value: c }) : m[i] = c, z = (m, i, c) => Ve(m, typeof i != "symbol" ? i + "" : i, c);
class V extends Error {
  constructor(i, c) {
    super("API Service Request Failed"), this.originalError = i, this.requestConfig = c, this.name = "ApiRequestError";
  }
}
const he = class ve {
  constructor() {
    z(this, "axiosInstance"), z(this, "maxRetries");
  }
  static init(i) {
    return this.instance || (this.instance = new ve(), this.instance.maxRetries = i.maxRetries ?? 3, this.instance.axiosInstance = this.instance.createAxiosInstance(i), this.instance.setupInterceptors(), this.instance.configureRetry()), this.instance;
  }
  static getInstance() {
    if (!this.instance)
      throw new Error("Http not initialized. Call Http.init() first.");
    return this.instance;
  }
  getAxiosInstance() {
    return this.axiosInstance;
  }
  setAxiosInstance(i) {
    this.axiosInstance = i;
  }
  getFullBaseUrl(i) {
    return i.baseURL;
  }
  createAxiosInstance(i) {
    const c = {
      baseURL: this.getFullBaseUrl(i),
      timeout: i.timeout ?? 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...i.headers
      },
      withCredentials: i.withCredentials ?? !0
    };
    return $e.create(c);
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (i) => i,
      (i) => Promise.reject(i)
    ), this.axiosInstance.interceptors.response.use(
      (i) => i,
      this.handleErrorResponse.bind(this)
    );
  }
  configureRetry() {
    B(this.axiosInstance, {
      retries: this.maxRetries,
      retryDelay: B.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(i) {
    var c;
    return B.isNetworkOrIdempotentRequestError(i) || ((c = i.response) == null ? void 0 : c.status) === 429;
  }
  handleErrorResponse(i) {
    return this.logError(i), Promise.reject(new V(i, i.config || {}));
  }
  logError(i) {
    var c, l, M, E;
    console.error("API Request Error", {
      url: (c = i.config) == null ? void 0 : c.url,
      method: (l = i.config) == null ? void 0 : l.method,
      status: (M = i.response) == null ? void 0 : M.status,
      data: (E = i.response) == null ? void 0 : E.data,
      message: i.message
    });
  }
  async request(i, c = {}) {
    try {
      const l = {
        timeout: 1e4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        ...i,
        ...c
      };
      return (await this.axiosInstance.request(
        l
      )).data;
    } catch (l) {
      throw l instanceof V ? l : new V(l, i);
    }
  }
  _setAxiosInstanceForTesting(i) {
    this.axiosInstance = i;
  }
};
z(he, "instance");
let ye = he;
class Ze extends ye {
  mutate(i, c = {}, l) {
    return this.request(
      {
        method: "POST",
        url: `{${l}/mutate}`,
        data: i
      },
      c
    );
  }
  executeAction(i, c = {}, l) {
    return this.request(
      {
        method: "POST",
        url: `${l}/actions/${i.action}`,
        data: i.params
      },
      c
    );
  }
  delete(i, c = {}, l) {
    return this.request(
      {
        method: "DELETE",
        url: l,
        data: i
      },
      c
    );
  }
  forceDelete(i, c = {}, l) {
    return this.request(
      {
        method: "DELETE",
        url: `$${l}/force`,
        data: i
      },
      c
    );
  }
  restore(i, c = {}, l) {
    return this.request(
      {
        method: "POST",
        url: `$${l}/restore`,
        data: i
      },
      c
    );
  }
}
class Qe extends ye {
  searchRequest(i, c = {}, l) {
    return this.request(
      {
        method: "POST",
        url: `{${l}/search}`,
        data: { search: i }
      },
      c
    );
  }
  async search(i, c = {}) {
    return (await this.searchRequest(i, c)).data;
  }
  searchPaginate(i, c = {}) {
    return this.searchRequest(i, c);
  }
  getdetails(i = {}, c) {
    return this.request(
      {
        method: "GET",
        url: c
      },
      i
    );
  }
}
export {
  ye as Http,
  Ze as Mutation,
  Qe as Query
};

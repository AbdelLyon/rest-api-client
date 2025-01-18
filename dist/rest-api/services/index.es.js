import B from "axios-retry";
import Le from "axios";
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
  var g;
  return function(a) {
    (function(c) {
      var h = typeof globalThis == "object" ? globalThis : typeof ce == "object" ? ce : typeof self == "object" ? self : typeof this == "object" ? this : A(), M = E(a);
      typeof h.Reflect < "u" && (M = E(h.Reflect, M)), c(M, h), typeof h.Reflect > "u" && (h.Reflect = a);
      function E(P, x) {
        return function(T, S) {
          Object.defineProperty(P, T, { configurable: !0, writable: !0, value: S }), x && x(T, S);
        };
      }
      function F() {
        try {
          return Function("return this;")();
        } catch {
        }
      }
      function I() {
        try {
          return (0, eval)("(function() { return this; })()");
        } catch {
        }
      }
      function A() {
        return F() || I();
      }
    })(function(c, h) {
      var M = Object.prototype.hasOwnProperty, E = typeof Symbol == "function", F = E && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", I = E && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", A = typeof Object.create == "function", P = { __proto__: [] } instanceof Array, x = !A && !P, T = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: A ? function() {
          return L(/* @__PURE__ */ Object.create(null));
        } : P ? function() {
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
      }, S = Object.getPrototypeOf(Function), C = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : Ge(), G = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : He(), H = typeof WeakMap == "function" ? WeakMap : Ue(), k = E ? Symbol.for("@reflect-metadata:registry") : void 0, q = qe(), z = De(q);
      function we(e, t, r, n) {
        if (d(r)) {
          if (!re(e))
            throw new TypeError();
          if (!ne(t))
            throw new TypeError();
          return Pe(e, t);
        } else {
          if (!re(e))
            throw new TypeError();
          if (!w(t))
            throw new TypeError();
          if (!w(n) && !d(n) && !R(n))
            throw new TypeError();
          return R(n) && (n = void 0), r = O(r), ke(e, t, r, n);
        }
      }
      c("decorate", we);
      function _e(e, t) {
        function r(n, f) {
          if (!w(n))
            throw new TypeError();
          if (!d(f) && !je(f))
            throw new TypeError();
          X(e, t, n, f);
        }
        return r;
      }
      c("metadata", _e);
      function me(e, t, r, n) {
        if (!w(r))
          throw new TypeError();
        return d(n) || (n = O(n)), X(e, t, r, n);
      }
      c("defineMetadata", me);
      function ge(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return d(r) || (r = O(r)), Z(e, t, r);
      }
      c("hasMetadata", ge);
      function Me(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return d(r) || (r = O(r)), U(e, t, r);
      }
      c("hasOwnMetadata", Me);
      function be(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return d(r) || (r = O(r)), Q(e, t, r);
      }
      c("getMetadata", be);
      function Oe(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return d(r) || (r = O(r)), J(e, t, r);
      }
      c("getOwnMetadata", Oe);
      function Ee(e, t) {
        if (!w(e))
          throw new TypeError();
        return d(t) || (t = O(t)), Y(e, t);
      }
      c("getMetadataKeys", Ee);
      function Te(e, t) {
        if (!w(e))
          throw new TypeError();
        return d(t) || (t = O(t)), K(e, t);
      }
      c("getOwnMetadataKeys", Te);
      function Ie(e, t, r) {
        if (!w(t))
          throw new TypeError();
        if (d(r) || (r = O(r)), !w(t))
          throw new TypeError();
        d(r) || (r = O(r));
        var n = j(
          t,
          r,
          /*Create*/
          !1
        );
        return d(n) ? !1 : n.OrdinaryDeleteMetadata(e, t, r);
      }
      c("deleteMetadata", Ie);
      function Pe(e, t) {
        for (var r = e.length - 1; r >= 0; --r) {
          var n = e[r], f = n(t);
          if (!d(f) && !R(f)) {
            if (!ne(f))
              throw new TypeError();
            t = f;
          }
        }
        return t;
      }
      function ke(e, t, r, n) {
        for (var f = e.length - 1; f >= 0; --f) {
          var m = e[f], _ = m(t, r, n);
          if (!d(_) && !R(_)) {
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
        var f = W(t);
        return R(f) ? !1 : Z(e, f, r);
      }
      function U(e, t, r) {
        var n = j(
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
        var f = W(t);
        if (!R(f))
          return Q(e, f, r);
      }
      function J(e, t, r) {
        var n = j(
          t,
          r,
          /*Create*/
          !1
        );
        if (!d(n))
          return n.OrdinaryGetOwnMetadata(e, t, r);
      }
      function X(e, t, r, n) {
        var f = j(
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
        for (var m = new G(), _ = [], l = 0, i = r; l < i.length; l++) {
          var s = i[l], o = m.has(s);
          o || (m.add(s), _.push(s));
        }
        for (var u = 0, v = f; u < v.length; u++) {
          var s = v[u], o = m.has(s);
          o || (m.add(s), _.push(s));
        }
        return _;
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
      function R(e) {
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
        var r = "string", n = ae(e, F);
        if (n !== void 0) {
          var f = n.call(e, r);
          if (w(f))
            throw new TypeError();
          return f;
        }
        return Se(e);
      }
      function Se(e, t) {
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
      function Ce(e) {
        return "" + e;
      }
      function O(e) {
        var t = xe(e);
        return Re(t) ? t : Ce(t);
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
        var t = ae(e, I);
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
      function Ae() {
        var e;
        !d(k) && typeof h.Reflect < "u" && !(k in h.Reflect) && typeof h.Reflect.defineMetadata == "function" && (e = Fe(h.Reflect));
        var t, r, n, f = new H(), m = {
          registerProvider: _,
          getProvider: i,
          setProvider: o
        };
        return m;
        function _(u) {
          if (!Object.isExtensible(m))
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
              n === void 0 && (n = new G()), n.add(u);
              break;
          }
        }
        function l(u, v) {
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
        function i(u, v) {
          var y = f.get(u), p;
          return d(y) || (p = y.get(v)), d(p) && (p = l(u, v), d(p) || (d(y) && (y = new C(), f.set(u, y)), y.set(v, p))), p;
        }
        function s(u) {
          if (d(u))
            throw new TypeError();
          return t === u || r === u || !d(n) && n.has(u);
        }
        function o(u, v, y) {
          if (!s(y))
            throw new Error("Metadata provider not registered.");
          var p = i(u, v);
          if (p !== y) {
            if (!d(p))
              return !1;
            var b = f.get(u);
            d(b) && (b = new C(), f.set(u, b)), b.set(v, y);
          }
          return !0;
        }
      }
      function qe() {
        var e;
        return !d(k) && w(h.Reflect) && Object.isExtensible(h.Reflect) && (e = h.Reflect[k]), d(e) && (e = Ae()), !d(k) && w(h.Reflect) && Object.isExtensible(h.Reflect) && Object.defineProperty(h.Reflect, k, {
          enumerable: !1,
          configurable: !1,
          writable: !1,
          value: e
        }), e;
      }
      function De(e) {
        var t = new H(), r = {
          isProviderFor: function(s, o) {
            var u = t.get(s);
            return d(u) ? !1 : u.has(o);
          },
          OrdinaryDefineOwnMetadata: _,
          OrdinaryHasOwnMetadata: f,
          OrdinaryGetOwnMetadata: m,
          OrdinaryOwnMetadataKeys: l,
          OrdinaryDeleteMetadata: i
        };
        return q.registerProvider(r), r;
        function n(s, o, u) {
          var v = t.get(s), y = !1;
          if (d(v)) {
            if (!u)
              return;
            v = new C(), t.set(s, v), y = !0;
          }
          var p = v.get(o);
          if (d(p)) {
            if (!u)
              return;
            if (p = new C(), v.set(o, p), !e.setProvider(s, o, r))
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
        function m(s, o, u) {
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
        function l(s, o) {
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
            var $e = se(fe);
            try {
              u[b] = $e;
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
        function i(s, o, u) {
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
      function Fe(e) {
        var t = e.defineMetadata, r = e.hasOwnMetadata, n = e.getOwnMetadata, f = e.getOwnMetadataKeys, m = e.deleteMetadata, _ = new H(), l = {
          isProviderFor: function(i, s) {
            var o = _.get(i);
            return !d(o) && o.has(s) ? !0 : f(i, s).length ? (d(o) && (o = new G(), _.set(i, o)), o.add(s), !0) : !1;
          },
          OrdinaryDefineOwnMetadata: t,
          OrdinaryHasOwnMetadata: r,
          OrdinaryGetOwnMetadata: n,
          OrdinaryOwnMetadataKeys: f,
          OrdinaryDeleteMetadata: m
        };
        return l;
      }
      function j(e, t, r) {
        var n = q.getProvider(e, t);
        if (!d(n))
          return n;
        if (r) {
          if (q.setProvider(e, t, z))
            return z;
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
            }, l.prototype[I] = function() {
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
                return this._keys.length--, this._values.length--, $(i, this._cacheKey) && (this._cacheKey = e, this._cacheIndex = -2), !0;
              }
              return !1;
            }, l.prototype.clear = function() {
              this._keys.length = 0, this._values.length = 0, this._cacheKey = e, this._cacheIndex = -2;
            }, l.prototype.keys = function() {
              return new r(this._keys, this._values, f);
            }, l.prototype.values = function() {
              return new r(this._keys, this._values, m);
            }, l.prototype.entries = function() {
              return new r(this._keys, this._values, _);
            }, l.prototype["@@iterator"] = function() {
              return this.entries();
            }, l.prototype[I] = function() {
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
        return n;
        function f(l, i) {
          return l;
        }
        function m(l, i) {
          return i;
        }
        function _(l, i) {
          return [l, i];
        }
      }
      function He() {
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
            }, t.prototype[I] = function() {
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
        function m(i, s) {
          for (var o = 0; o < s; ++o)
            i[o] = Math.random() * 255 | 0;
          return i;
        }
        function _(i) {
          if (typeof Uint8Array == "function") {
            var s = new Uint8Array(i);
            return typeof crypto < "u" ? crypto.getRandomValues(s) : typeof msCrypto < "u" ? msCrypto.getRandomValues(s) : m(s, i), s;
          }
          return m(new Array(i), i);
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
      function L(e) {
        return e.__ = void 0, delete e.__, e;
      }
    });
  }(g || (g = {})), de;
}
Be();
var Ne = Object.defineProperty, Ve = (g, a, c) => a in g ? Ne(g, a, { enumerable: !0, configurable: !0, writable: !0, value: c }) : g[a] = c, V = (g, a, c) => Ve(g, typeof a != "symbol" ? a + "" : a, c);
class N extends Error {
  constructor(a, c) {
    super("API Service Request Failed"), this.originalError = a, this.requestConfig = c, this.name = "ApiRequestError";
  }
}
const ve = class ye {
  constructor() {
    V(this, "axiosInstance"), V(this, "maxRetries");
  }
  static init(a) {
    return this.instance || (this.instance = new ye(), this.instance.maxRetries = a.maxRetries ?? 3, this.instance.axiosInstance = this.instance.createAxiosInstance(a), this.instance.setupInterceptors(), this.instance.configureRetry()), this.instance;
  }
  static getInstance() {
    if (!this.instance)
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
    const c = {
      baseURL: this.getFullBaseUrl(a),
      timeout: a.timeout ?? 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...a.headers
      },
      withCredentials: a.withCredentials ?? !0
    };
    return Le.create(c);
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
    B(this.axiosInstance, {
      retries: this.maxRetries,
      retryDelay: B.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(a) {
    var c;
    return B.isNetworkOrIdempotentRequestError(a) || ((c = a.response) == null ? void 0 : c.status) === 429;
  }
  handleErrorResponse(a) {
    return this.logError(a), Promise.reject(new N(a, a.config || {}));
  }
  logError(a) {
    var c, h, M, E;
    console.error("API Request Error", {
      url: (c = a.config) == null ? void 0 : c.url,
      method: (h = a.config) == null ? void 0 : h.method,
      status: (M = a.response) == null ? void 0 : M.status,
      data: (E = a.response) == null ? void 0 : E.data,
      message: a.message
    });
  }
  async request(a, c = {}) {
    try {
      const h = {
        timeout: 1e4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        ...a,
        ...c
      };
      return (await this.axiosInstance.request(
        h
      )).data;
    } catch (h) {
      throw h instanceof N ? h : new N(h, a);
    }
  }
  _setAxiosInstanceForTesting(a) {
    this.axiosInstance = a;
  }
};
V(ve, "instance");
let pe = ve;
class Xe extends pe {
  mutate(a, c = {}, h) {
    return this.request(
      {
        method: "POST",
        url: `{${h}/mutate}`,
        data: a
      },
      c
    );
  }
  executeAction(a, c = {}, h) {
    return this.request(
      {
        method: "POST",
        url: `${h}/actions/${a.action}`,
        data: a.params
      },
      c
    );
  }
  delete(a, c = {}, h) {
    return this.request(
      {
        method: "DELETE",
        url: h,
        data: a
      },
      c
    );
  }
  forceDelete(a, c = {}, h) {
    return this.request(
      {
        method: "DELETE",
        url: `$${h}/force`,
        data: a
      },
      c
    );
  }
  restore(a, c = {}, h) {
    return this.request(
      {
        method: "POST",
        url: `$${h}/restore`,
        data: a
      },
      c
    );
  }
}
var ze = Object.defineProperty, Ze = (g, a, c) => a in g ? ze(g, a, { enumerable: !0, configurable: !0, writable: !0, value: c }) : g[a] = c, he = (g, a, c) => Ze(g, typeof a != "symbol" ? a + "" : a, c);
class Ye {
  constructor(a) {
    he(this, "http"), he(this, "pathname"), this.http = pe.getInstance(), this.pathname = a;
  }
  searchRequest(a, c = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/search`,
        data: { search: a }
      },
      c
    );
  }
  async search(a, c = {}) {
    return (await this.searchRequest(a, c)).data;
  }
  searchPaginate(a, c = {}) {
    return this.searchRequest(a, c);
  }
  getdetails(a = {}) {
    return this.http.request(
      {
        method: "GET",
        url: this.pathname
      },
      a
    );
  }
}
export {
  pe as Http,
  Xe as Mutation,
  Ye as Query
};

import V from "axios-retry";
import He from "axios";
var fe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ce = {};
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
var de;
function Le() {
  if (de) return ce;
  de = 1;
  var M;
  return function(i) {
    (function(d) {
      var v = typeof globalThis == "object" ? globalThis : typeof fe == "object" ? fe : typeof self == "object" ? self : typeof this == "object" ? this : A(), m = E(i);
      typeof v.Reflect < "u" && (m = E(v.Reflect, m)), d(m, v), typeof v.Reflect > "u" && (v.Reflect = i);
      function E(k, x) {
        return function(T, S) {
          Object.defineProperty(k, T, { configurable: !0, writable: !0, value: S }), x && x(T, S);
        };
      }
      function G() {
        try {
          return Function("return this;")();
        } catch {
        }
      }
      function R() {
        try {
          return (0, eval)("(function() { return this; })()");
        } catch {
        }
      }
      function A() {
        return G() || R();
      }
    })(function(d, v) {
      var m = Object.prototype.hasOwnProperty, E = typeof Symbol == "function", G = E && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", R = E && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", A = typeof Object.create == "function", k = { __proto__: [] } instanceof Array, x = !A && !k, T = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: A ? function() {
          return B(/* @__PURE__ */ Object.create(null));
        } : k ? function() {
          return B({ __proto__: null });
        } : function() {
          return B({});
        },
        has: x ? function(e, t) {
          return m.call(e, t);
        } : function(e, t) {
          return t in e;
        },
        get: x ? function(e, t) {
          return m.call(e, t) ? e[t] : void 0;
        } : function(e, t) {
          return e[t];
        }
      }, S = Object.getPrototypeOf(Function), j = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : qe(), F = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : De(), U = typeof WeakMap == "function" ? WeakMap : Ge(), I = E ? Symbol.for("@reflect-metadata:registry") : void 0, q = je(), z = Ce(q);
      function ve(e, t, r, n) {
        if (c(r)) {
          if (!te(e))
            throw new TypeError();
          if (!re(t))
            throw new TypeError();
          return Ee(e, t);
        } else {
          if (!te(e))
            throw new TypeError();
          if (!w(t))
            throw new TypeError();
          if (!w(n) && !c(n) && !P(n))
            throw new TypeError();
          return P(n) && (n = void 0), r = O(r), Te(e, t, r, n);
        }
      }
      d("decorate", ve);
      function ye(e, t) {
        function r(n, f) {
          if (!w(n))
            throw new TypeError();
          if (!c(f) && !xe(f))
            throw new TypeError();
          Q(e, t, n, f);
        }
        return r;
      }
      d("metadata", ye);
      function pe(e, t, r, n) {
        if (!w(r))
          throw new TypeError();
        return c(n) || (n = O(n)), Q(e, t, r, n);
      }
      d("defineMetadata", pe);
      function we(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return c(r) || (r = O(r)), X(e, t, r);
      }
      d("hasMetadata", we);
      function _e(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return c(r) || (r = O(r)), H(e, t, r);
      }
      d("hasOwnMetadata", _e);
      function ge(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return c(r) || (r = O(r)), $(e, t, r);
      }
      d("getMetadata", ge);
      function Me(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return c(r) || (r = O(r)), Z(e, t, r);
      }
      d("getOwnMetadata", Me);
      function me(e, t) {
        if (!w(e))
          throw new TypeError();
        return c(t) || (t = O(t)), J(e, t);
      }
      d("getMetadataKeys", me);
      function be(e, t) {
        if (!w(e))
          throw new TypeError();
        return c(t) || (t = O(t)), Y(e, t);
      }
      d("getOwnMetadataKeys", be);
      function Oe(e, t, r) {
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
      d("deleteMetadata", Oe);
      function Ee(e, t) {
        for (var r = e.length - 1; r >= 0; --r) {
          var n = e[r], f = n(t);
          if (!c(f) && !P(f)) {
            if (!re(f))
              throw new TypeError();
            t = f;
          }
        }
        return t;
      }
      function Te(e, t, r, n) {
        for (var f = e.length - 1; f >= 0; --f) {
          var g = e[f], _ = g(t, r, n);
          if (!c(_) && !P(_)) {
            if (!w(_))
              throw new TypeError();
            n = _;
          }
        }
        return n;
      }
      function X(e, t, r) {
        var n = H(e, t, r);
        if (n)
          return !0;
        var f = W(t);
        return P(f) ? !1 : X(e, f, r);
      }
      function H(e, t, r) {
        var n = C(
          t,
          r,
          /*Create*/
          !1
        );
        return c(n) ? !1 : ee(n.OrdinaryHasOwnMetadata(e, t, r));
      }
      function $(e, t, r) {
        var n = H(e, t, r);
        if (n)
          return Z(e, t, r);
        var f = W(t);
        if (!P(f))
          return $(e, f, r);
      }
      function Z(e, t, r) {
        var n = C(
          t,
          r,
          /*Create*/
          !1
        );
        if (!c(n))
          return n.OrdinaryGetOwnMetadata(e, t, r);
      }
      function Q(e, t, r, n) {
        var f = C(
          r,
          n,
          /*Create*/
          !0
        );
        f.OrdinaryDefineOwnMetadata(e, t, r, n);
      }
      function J(e, t) {
        var r = Y(e, t), n = W(e);
        if (n === null)
          return r;
        var f = J(n, t);
        if (f.length <= 0)
          return r;
        if (r.length <= 0)
          return f;
        for (var g = new F(), _ = [], l = 0, a = r; l < a.length; l++) {
          var o = a[l], s = g.has(o);
          s || (g.add(o), _.push(o));
        }
        for (var u = 0, h = f; u < h.length; u++) {
          var o = h[u], s = g.has(o);
          s || (g.add(o), _.push(o));
        }
        return _;
      }
      function Y(e, t) {
        var r = C(
          e,
          t,
          /*create*/
          !1
        );
        return r ? r.OrdinaryOwnMetadataKeys(e, t) : [];
      }
      function K(e) {
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
      function P(e) {
        return e === null;
      }
      function Re(e) {
        return typeof e == "symbol";
      }
      function w(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      }
      function ke(e, t) {
        switch (K(e)) {
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
        var r = "string", n = ne(e, G);
        if (n !== void 0) {
          var f = n.call(e, r);
          if (w(f))
            throw new TypeError();
          return f;
        }
        return Ie(e);
      }
      function Ie(e, t) {
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
      function ee(e) {
        return !!e;
      }
      function Pe(e) {
        return "" + e;
      }
      function O(e) {
        var t = ke(e);
        return Re(t) ? t : Pe(t);
      }
      function te(e) {
        return Array.isArray ? Array.isArray(e) : e instanceof Object ? e instanceof Array : Object.prototype.toString.call(e) === "[object Array]";
      }
      function D(e) {
        return typeof e == "function";
      }
      function re(e) {
        return typeof e == "function";
      }
      function xe(e) {
        switch (K(e)) {
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
      function ne(e, t) {
        var r = e[t];
        if (r != null) {
          if (!D(r))
            throw new TypeError();
          return r;
        }
      }
      function ae(e) {
        var t = ne(e, R);
        if (!D(t))
          throw new TypeError();
        var r = t.call(e);
        if (!w(r))
          throw new TypeError();
        return r;
      }
      function ie(e) {
        return e.value;
      }
      function oe(e) {
        var t = e.next();
        return t.done ? !1 : t;
      }
      function se(e) {
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
      function Se() {
        var e;
        !c(I) && typeof v.Reflect < "u" && !(I in v.Reflect) && typeof v.Reflect.defineMetadata == "function" && (e = Ae(v.Reflect));
        var t, r, n, f = new U(), g = {
          registerProvider: _,
          getProvider: a,
          setProvider: s
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
                for (var y = ae(n); ; ) {
                  var p = oe(y);
                  if (!p)
                    return;
                  var b = ie(p);
                  if (b.isProviderFor(u, h))
                    return se(y), b;
                }
            }
          }
          if (!c(e) && e.isProviderFor(u, h))
            return e;
        }
        function a(u, h) {
          var y = f.get(u), p;
          return c(y) || (p = y.get(h)), c(p) && (p = l(u, h), c(p) || (c(y) && (y = new j(), f.set(u, y)), y.set(h, p))), p;
        }
        function o(u) {
          if (c(u))
            throw new TypeError();
          return t === u || r === u || !c(n) && n.has(u);
        }
        function s(u, h, y) {
          if (!o(y))
            throw new Error("Metadata provider not registered.");
          var p = a(u, h);
          if (p !== y) {
            if (!c(p))
              return !1;
            var b = f.get(u);
            c(b) && (b = new j(), f.set(u, b)), b.set(h, y);
          }
          return !0;
        }
      }
      function je() {
        var e;
        return !c(I) && w(v.Reflect) && Object.isExtensible(v.Reflect) && (e = v.Reflect[I]), c(e) && (e = Se()), !c(I) && w(v.Reflect) && Object.isExtensible(v.Reflect) && Object.defineProperty(v.Reflect, I, {
          enumerable: !1,
          configurable: !1,
          writable: !1,
          value: e
        }), e;
      }
      function Ce(e) {
        var t = new U(), r = {
          isProviderFor: function(o, s) {
            var u = t.get(o);
            return c(u) ? !1 : u.has(s);
          },
          OrdinaryDefineOwnMetadata: _,
          OrdinaryHasOwnMetadata: f,
          OrdinaryGetOwnMetadata: g,
          OrdinaryOwnMetadataKeys: l,
          OrdinaryDeleteMetadata: a
        };
        return q.registerProvider(r), r;
        function n(o, s, u) {
          var h = t.get(o), y = !1;
          if (c(h)) {
            if (!u)
              return;
            h = new j(), t.set(o, h), y = !0;
          }
          var p = h.get(s);
          if (c(p)) {
            if (!u)
              return;
            if (p = new j(), h.set(s, p), !e.setProvider(o, s, r))
              throw h.delete(s), y && t.delete(o), new Error("Wrong provider for target.");
          }
          return p;
        }
        function f(o, s, u) {
          var h = n(
            s,
            u,
            /*Create*/
            !1
          );
          return c(h) ? !1 : ee(h.has(o));
        }
        function g(o, s, u) {
          var h = n(
            s,
            u,
            /*Create*/
            !1
          );
          if (!c(h))
            return h.get(o);
        }
        function _(o, s, u, h) {
          var y = n(
            u,
            h,
            /*Create*/
            !0
          );
          y.set(o, s);
        }
        function l(o, s) {
          var u = [], h = n(
            o,
            s,
            /*Create*/
            !1
          );
          if (c(h))
            return u;
          for (var y = h.keys(), p = ae(y), b = 0; ; ) {
            var ue = oe(p);
            if (!ue)
              return u.length = b, u;
            var Fe = ie(ue);
            try {
              u[b] = Fe;
            } catch (Ue) {
              try {
                se(p);
              } finally {
                throw Ue;
              }
            }
            b++;
          }
        }
        function a(o, s, u) {
          var h = n(
            s,
            u,
            /*Create*/
            !1
          );
          if (c(h) || !h.delete(o))
            return !1;
          if (h.size === 0) {
            var y = t.get(s);
            c(y) || (y.delete(u), y.size === 0 && t.delete(y));
          }
          return !0;
        }
      }
      function Ae(e) {
        var t = e.defineMetadata, r = e.hasOwnMetadata, n = e.getOwnMetadata, f = e.getOwnMetadataKeys, g = e.deleteMetadata, _ = new U(), l = {
          isProviderFor: function(a, o) {
            var s = _.get(a);
            return !c(s) && s.has(o) ? !0 : f(a, o).length ? (c(s) && (s = new F(), _.set(a, s)), s.add(o), !0) : !1;
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
          if (q.setProvider(e, t, z))
            return z;
          throw new Error("Illegal state.");
        }
      }
      function qe() {
        var e = {}, t = [], r = (
          /** @class */
          function() {
            function l(a, o, s) {
              this._index = 0, this._keys = a, this._values = o, this._selector = s;
            }
            return l.prototype["@@iterator"] = function() {
              return this;
            }, l.prototype[R] = function() {
              return this;
            }, l.prototype.next = function() {
              var a = this._index;
              if (a >= 0 && a < this._keys.length) {
                var o = this._selector(this._keys[a], this._values[a]);
                return a + 1 >= this._keys.length ? (this._index = -1, this._keys = t, this._values = t) : this._index++, { value: o, done: !1 };
              }
              return { value: void 0, done: !0 };
            }, l.prototype.throw = function(a) {
              throw this._index >= 0 && (this._index = -1, this._keys = t, this._values = t), a;
            }, l.prototype.return = function(a) {
              return this._index >= 0 && (this._index = -1, this._keys = t, this._values = t), { value: a, done: !0 };
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
            }), l.prototype.has = function(a) {
              return this._find(
                a,
                /*insert*/
                !1
              ) >= 0;
            }, l.prototype.get = function(a) {
              var o = this._find(
                a,
                /*insert*/
                !1
              );
              return o >= 0 ? this._values[o] : void 0;
            }, l.prototype.set = function(a, o) {
              var s = this._find(
                a,
                /*insert*/
                !0
              );
              return this._values[s] = o, this;
            }, l.prototype.delete = function(a) {
              var o = this._find(
                a,
                /*insert*/
                !1
              );
              if (o >= 0) {
                for (var s = this._keys.length, u = o + 1; u < s; u++)
                  this._keys[u - 1] = this._keys[u], this._values[u - 1] = this._values[u];
                return this._keys.length--, this._values.length--, L(a, this._cacheKey) && (this._cacheKey = e, this._cacheIndex = -2), !0;
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
            }, l.prototype[R] = function() {
              return this.entries();
            }, l.prototype._find = function(a, o) {
              if (!L(this._cacheKey, a)) {
                this._cacheIndex = -1;
                for (var s = 0; s < this._keys.length; s++)
                  if (L(this._keys[s], a)) {
                    this._cacheIndex = s;
                    break;
                  }
              }
              return this._cacheIndex < 0 && o && (this._cacheIndex = this._keys.length, this._keys.push(a), this._values.push(void 0)), this._cacheIndex;
            }, l;
          }()
        );
        return n;
        function f(l, a) {
          return l;
        }
        function g(l, a) {
          return a;
        }
        function _(l, a) {
          return [l, a];
        }
      }
      function De() {
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
            }, t.prototype[R] = function() {
              return this.keys();
            }, t;
          }()
        );
        return e;
      }
      function Ge() {
        var e = 16, t = T.create(), r = n();
        return (
          /** @class */
          function() {
            function a() {
              this._key = n();
            }
            return a.prototype.has = function(o) {
              var s = f(
                o,
                /*create*/
                !1
              );
              return s !== void 0 ? T.has(s, this._key) : !1;
            }, a.prototype.get = function(o) {
              var s = f(
                o,
                /*create*/
                !1
              );
              return s !== void 0 ? T.get(s, this._key) : void 0;
            }, a.prototype.set = function(o, s) {
              var u = f(
                o,
                /*create*/
                !0
              );
              return u[this._key] = s, this;
            }, a.prototype.delete = function(o) {
              var s = f(
                o,
                /*create*/
                !1
              );
              return s !== void 0 ? delete s[this._key] : !1;
            }, a.prototype.clear = function() {
              this._key = n();
            }, a;
          }()
        );
        function n() {
          var a;
          do
            a = "@@WeakMap@@" + l();
          while (T.has(t, a));
          return t[a] = !0, a;
        }
        function f(a, o) {
          if (!m.call(a, r)) {
            if (!o)
              return;
            Object.defineProperty(a, r, { value: T.create() });
          }
          return a[r];
        }
        function g(a, o) {
          for (var s = 0; s < o; ++s)
            a[s] = Math.random() * 255 | 0;
          return a;
        }
        function _(a) {
          if (typeof Uint8Array == "function") {
            var o = new Uint8Array(a);
            return typeof crypto < "u" ? crypto.getRandomValues(o) : typeof msCrypto < "u" ? msCrypto.getRandomValues(o) : g(o, a), o;
          }
          return g(new Array(a), a);
        }
        function l() {
          var a = _(e);
          a[6] = a[6] & 79 | 64, a[8] = a[8] & 191 | 128;
          for (var o = "", s = 0; s < e; ++s) {
            var u = a[s];
            (s === 4 || s === 6 || s === 8) && (o += "-"), u < 16 && (o += "0"), o += u.toString(16).toLowerCase();
          }
          return o;
        }
      }
      function B(e) {
        return e.__ = void 0, delete e.__, e;
      }
    });
  }(M || (M = {})), ce;
}
Le();
var We = Object.defineProperty, Be = (M, i, d) => i in M ? We(M, i, { enumerable: !0, configurable: !0, writable: !0, value: d }) : M[i] = d, le = (M, i, d) => Be(M, typeof i != "symbol" ? i + "" : i, d);
class N extends Error {
  constructor(i, d) {
    super("API Service Request Failed"), this.originalError = i, this.requestConfig = d, this.name = "ApiRequestError";
  }
}
class he {
  constructor(i) {
    le(this, "axiosInstance"), le(this, "MAX_RETRIES"), this.MAX_RETRIES = i.maxRetries ?? 3, this.axiosInstance = this.createAxiosInstance(i), this.setupInterceptors(), this.configureRetry();
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
    const d = {
      baseURL: this.getFullBaseUrl(i),
      timeout: i.timeout ?? 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...i.headers
      },
      withCredentials: i.withCredentials ?? !0
    };
    return He.create(d);
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
    V(this.axiosInstance, {
      retries: this.MAX_RETRIES,
      retryDelay: V.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(i) {
    var d;
    return V.isNetworkOrIdempotentRequestError(i) || ((d = i.response) == null ? void 0 : d.status) === 429;
  }
  handleErrorResponse(i) {
    return this.logError(i), Promise.reject(new N(i, i.config || {}));
  }
  logError(i) {
    var d, v, m, E;
    console.error("API Request Error", {
      url: (d = i.config) == null ? void 0 : d.url,
      method: (v = i.config) == null ? void 0 : v.method,
      status: (m = i.response) == null ? void 0 : m.status,
      data: (E = i.response) == null ? void 0 : E.data,
      message: i.message
    });
  }
  async request(i, d = {}) {
    try {
      const v = {
        timeout: 1e4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        ...i,
        ...d
      };
      return (await this.axiosInstance.request(
        v
      )).data;
    } catch (v) {
      throw v instanceof N ? v : new N(v, i);
    }
  }
}
class ze extends he {
  constructor(i) {
    super({
      baseURL: `/${i}`
    });
  }
  mutate(i, d = {}) {
    return this.request(
      {
        method: "POST",
        url: "/mutate",
        data: i
      },
      d
    );
  }
  executeAction(i, d = {}) {
    return this.request(
      {
        method: "POST",
        url: `/actions/${i.action}`,
        data: i.params
      },
      d
    );
  }
  delete(i, d = {}) {
    return this.request(
      {
        method: "DELETE",
        url: "",
        data: i
      },
      d
    );
  }
  forceDelete(i, d = {}) {
    return this.request(
      {
        method: "DELETE",
        url: "/force",
        data: i
      },
      d
    );
  }
  restore(i, d = {}) {
    return this.request(
      {
        method: "POST",
        url: "/restore",
        data: i
      },
      d
    );
  }
}
class Xe extends he {
  constructor(i) {
    super({
      baseURL: `/${i}`
    });
  }
  searchRequest(i, d = {}) {
    return this.request(
      {
        method: "POST",
        url: "/search",
        data: { search: i }
      },
      d
    );
  }
  async search(i, d = {}) {
    return (await this.searchRequest(i, d)).data;
  }
  searchPaginate(i, d = {}) {
    return this.searchRequest(i, d);
  }
  getdetails(i = {}) {
    return this.request(
      {
        method: "GET",
        url: ""
      },
      i
    );
  }
}
export {
  he as Http,
  ze as Mutation,
  Xe as Query
};

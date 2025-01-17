var fe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ue = {};
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
var se;
function He() {
  if (se) return ue;
  se = 1;
  var b;
  return function(y) {
    (function(l) {
      var h = typeof globalThis == "object" ? globalThis : typeof fe == "object" ? fe : typeof self == "object" ? self : typeof this == "object" ? this : G(), g = T(y);
      typeof h.Reflect < "u" && (g = T(h.Reflect, g)), l(g, h), typeof h.Reflect > "u" && (h.Reflect = y);
      function T(E, R) {
        return function(k, j) {
          Object.defineProperty(E, k, { configurable: !0, writable: !0, value: j }), R && R(k, j);
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
      function G() {
        return F() || I();
      }
    })(function(l, h) {
      var g = Object.prototype.hasOwnProperty, T = typeof Symbol == "function", F = T && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", I = T && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", G = typeof Object.create == "function", E = { __proto__: [] } instanceof Array, R = !G && !E, k = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: G ? function() {
          return V(/* @__PURE__ */ Object.create(null));
        } : E ? function() {
          return V({ __proto__: null });
        } : function() {
          return V({});
        },
        has: R ? function(e, t) {
          return g.call(e, t);
        } : function(e, t) {
          return t in e;
        },
        get: R ? function(e, t) {
          return g.call(e, t) ? e[t] : void 0;
        } : function(e, t) {
          return e[t];
        }
      }, j = Object.getPrototypeOf(Function), C = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : xe(), H = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : Ge(), U = typeof WeakMap == "function" ? WeakMap : De(), P = T ? Symbol.for("@reflect-metadata:registry") : void 0, D = Re(), z = je(D);
      function le(e, t, r, n) {
        if (s(r)) {
          if (!K(e))
            throw new TypeError();
          if (!ee(t))
            throw new TypeError();
          return me(e, t);
        } else {
          if (!K(e))
            throw new TypeError();
          if (!w(t))
            throw new TypeError();
          if (!w(n) && !s(n) && !S(n))
            throw new TypeError();
          return S(n) && (n = void 0), r = O(r), Oe(e, t, r, n);
        }
      }
      l("decorate", le);
      function he(e, t) {
        function r(n, u) {
          if (!w(n))
            throw new TypeError();
          if (!s(u) && !Pe(u))
            throw new TypeError();
          Z(e, t, n, u);
        }
        return r;
      }
      l("metadata", he);
      function ve(e, t, r, n) {
        if (!w(r))
          throw new TypeError();
        return s(n) || (n = O(n)), Z(e, t, r, n);
      }
      l("defineMetadata", ve);
      function ye(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return s(r) || (r = O(r)), B(e, t, r);
      }
      l("hasMetadata", ye);
      function pe(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return s(r) || (r = O(r)), W(e, t, r);
      }
      l("hasOwnMetadata", pe);
      function we(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return s(r) || (r = O(r)), L(e, t, r);
      }
      l("getMetadata", we);
      function _e(e, t, r) {
        if (!w(t))
          throw new TypeError();
        return s(r) || (r = O(r)), Q(e, t, r);
      }
      l("getOwnMetadata", _e);
      function Me(e, t) {
        if (!w(e))
          throw new TypeError();
        return s(t) || (t = O(t)), $(e, t);
      }
      l("getMetadataKeys", Me);
      function be(e, t) {
        if (!w(e))
          throw new TypeError();
        return s(t) || (t = O(t)), J(e, t);
      }
      l("getOwnMetadataKeys", be);
      function ge(e, t, r) {
        if (!w(t))
          throw new TypeError();
        if (s(r) || (r = O(r)), !w(t))
          throw new TypeError();
        s(r) || (r = O(r));
        var n = x(
          t,
          r,
          /*Create*/
          !1
        );
        return s(n) ? !1 : n.OrdinaryDeleteMetadata(e, t, r);
      }
      l("deleteMetadata", ge);
      function me(e, t) {
        for (var r = e.length - 1; r >= 0; --r) {
          var n = e[r], u = n(t);
          if (!s(u) && !S(u)) {
            if (!ee(u))
              throw new TypeError();
            t = u;
          }
        }
        return t;
      }
      function Oe(e, t, r, n) {
        for (var u = e.length - 1; u >= 0; --u) {
          var M = e[u], _ = M(t, r, n);
          if (!s(_) && !S(_)) {
            if (!w(_))
              throw new TypeError();
            n = _;
          }
        }
        return n;
      }
      function B(e, t, r) {
        var n = W(e, t, r);
        if (n)
          return !0;
        var u = N(t);
        return S(u) ? !1 : B(e, u, r);
      }
      function W(e, t, r) {
        var n = x(
          t,
          r,
          /*Create*/
          !1
        );
        return s(n) ? !1 : Y(n.OrdinaryHasOwnMetadata(e, t, r));
      }
      function L(e, t, r) {
        var n = W(e, t, r);
        if (n)
          return Q(e, t, r);
        var u = N(t);
        if (!S(u))
          return L(e, u, r);
      }
      function Q(e, t, r) {
        var n = x(
          t,
          r,
          /*Create*/
          !1
        );
        if (!s(n))
          return n.OrdinaryGetOwnMetadata(e, t, r);
      }
      function Z(e, t, r, n) {
        var u = x(
          r,
          n,
          /*Create*/
          !0
        );
        u.OrdinaryDefineOwnMetadata(e, t, r, n);
      }
      function $(e, t) {
        var r = J(e, t), n = N(e);
        if (n === null)
          return r;
        var u = $(n, t);
        if (u.length <= 0)
          return r;
        if (r.length <= 0)
          return u;
        for (var M = new H(), _ = [], c = 0, a = r; c < a.length; c++) {
          var i = a[c], o = M.has(i);
          o || (M.add(i), _.push(i));
        }
        for (var f = 0, d = u; f < d.length; f++) {
          var i = d[f], o = M.has(i);
          o || (M.add(i), _.push(i));
        }
        return _;
      }
      function J(e, t) {
        var r = x(
          e,
          t,
          /*create*/
          !1
        );
        return r ? r.OrdinaryOwnMetadataKeys(e, t) : [];
      }
      function X(e) {
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
      function s(e) {
        return e === void 0;
      }
      function S(e) {
        return e === null;
      }
      function ke(e) {
        return typeof e == "symbol";
      }
      function w(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      }
      function Te(e, t) {
        switch (X(e)) {
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
        var r = "string", n = te(e, F);
        if (n !== void 0) {
          var u = n.call(e, r);
          if (w(u))
            throw new TypeError();
          return u;
        }
        return Ie(e);
      }
      function Ie(e, t) {
        var r, n;
        {
          var u = e.toString;
          if (A(u)) {
            var n = u.call(e);
            if (!w(n))
              return n;
          }
          var r = e.valueOf;
          if (A(r)) {
            var n = r.call(e);
            if (!w(n))
              return n;
          }
        }
        throw new TypeError();
      }
      function Y(e) {
        return !!e;
      }
      function Ee(e) {
        return "" + e;
      }
      function O(e) {
        var t = Te(e);
        return ke(t) ? t : Ee(t);
      }
      function K(e) {
        return Array.isArray ? Array.isArray(e) : e instanceof Object ? e instanceof Array : Object.prototype.toString.call(e) === "[object Array]";
      }
      function A(e) {
        return typeof e == "function";
      }
      function ee(e) {
        return typeof e == "function";
      }
      function Pe(e) {
        switch (X(e)) {
          case 3:
            return !0;
          case 4:
            return !0;
          default:
            return !1;
        }
      }
      function q(e, t) {
        return e === t || e !== e && t !== t;
      }
      function te(e, t) {
        var r = e[t];
        if (r != null) {
          if (!A(r))
            throw new TypeError();
          return r;
        }
      }
      function re(e) {
        var t = te(e, I);
        if (!A(t))
          throw new TypeError();
        var r = t.call(e);
        if (!w(r))
          throw new TypeError();
        return r;
      }
      function ne(e) {
        return e.value;
      }
      function ae(e) {
        var t = e.next();
        return t.done ? !1 : t;
      }
      function ie(e) {
        var t = e.return;
        t && t.call(e);
      }
      function N(e) {
        var t = Object.getPrototypeOf(e);
        if (typeof e != "function" || e === j || t !== j)
          return t;
        var r = e.prototype, n = r && Object.getPrototypeOf(r);
        if (n == null || n === Object.prototype)
          return t;
        var u = n.constructor;
        return typeof u != "function" || u === e ? t : u;
      }
      function Se() {
        var e;
        !s(P) && typeof h.Reflect < "u" && !(P in h.Reflect) && typeof h.Reflect.defineMetadata == "function" && (e = Ce(h.Reflect));
        var t, r, n, u = new U(), M = {
          registerProvider: _,
          getProvider: a,
          setProvider: o
        };
        return M;
        function _(f) {
          if (!Object.isExtensible(M))
            throw new Error("Cannot add provider to a frozen registry.");
          switch (!0) {
            case e === f:
              break;
            case s(t):
              t = f;
              break;
            case t === f:
              break;
            case s(r):
              r = f;
              break;
            case r === f:
              break;
            default:
              n === void 0 && (n = new H()), n.add(f);
              break;
          }
        }
        function c(f, d) {
          if (!s(t)) {
            if (t.isProviderFor(f, d))
              return t;
            if (!s(r)) {
              if (r.isProviderFor(f, d))
                return t;
              if (!s(n))
                for (var v = re(n); ; ) {
                  var p = ae(v);
                  if (!p)
                    return;
                  var m = ne(p);
                  if (m.isProviderFor(f, d))
                    return ie(v), m;
                }
            }
          }
          if (!s(e) && e.isProviderFor(f, d))
            return e;
        }
        function a(f, d) {
          var v = u.get(f), p;
          return s(v) || (p = v.get(d)), s(p) && (p = c(f, d), s(p) || (s(v) && (v = new C(), u.set(f, v)), v.set(d, p))), p;
        }
        function i(f) {
          if (s(f))
            throw new TypeError();
          return t === f || r === f || !s(n) && n.has(f);
        }
        function o(f, d, v) {
          if (!i(v))
            throw new Error("Metadata provider not registered.");
          var p = a(f, d);
          if (p !== v) {
            if (!s(p))
              return !1;
            var m = u.get(f);
            s(m) && (m = new C(), u.set(f, m)), m.set(d, v);
          }
          return !0;
        }
      }
      function Re() {
        var e;
        return !s(P) && w(h.Reflect) && Object.isExtensible(h.Reflect) && (e = h.Reflect[P]), s(e) && (e = Se()), !s(P) && w(h.Reflect) && Object.isExtensible(h.Reflect) && Object.defineProperty(h.Reflect, P, {
          enumerable: !1,
          configurable: !1,
          writable: !1,
          value: e
        }), e;
      }
      function je(e) {
        var t = new U(), r = {
          isProviderFor: function(i, o) {
            var f = t.get(i);
            return s(f) ? !1 : f.has(o);
          },
          OrdinaryDefineOwnMetadata: _,
          OrdinaryHasOwnMetadata: u,
          OrdinaryGetOwnMetadata: M,
          OrdinaryOwnMetadataKeys: c,
          OrdinaryDeleteMetadata: a
        };
        return D.registerProvider(r), r;
        function n(i, o, f) {
          var d = t.get(i), v = !1;
          if (s(d)) {
            if (!f)
              return;
            d = new C(), t.set(i, d), v = !0;
          }
          var p = d.get(o);
          if (s(p)) {
            if (!f)
              return;
            if (p = new C(), d.set(o, p), !e.setProvider(i, o, r))
              throw d.delete(o), v && t.delete(i), new Error("Wrong provider for target.");
          }
          return p;
        }
        function u(i, o, f) {
          var d = n(
            o,
            f,
            /*Create*/
            !1
          );
          return s(d) ? !1 : Y(d.has(i));
        }
        function M(i, o, f) {
          var d = n(
            o,
            f,
            /*Create*/
            !1
          );
          if (!s(d))
            return d.get(i);
        }
        function _(i, o, f, d) {
          var v = n(
            f,
            d,
            /*Create*/
            !0
          );
          v.set(i, o);
        }
        function c(i, o) {
          var f = [], d = n(
            i,
            o,
            /*Create*/
            !1
          );
          if (s(d))
            return f;
          for (var v = d.keys(), p = re(v), m = 0; ; ) {
            var oe = ae(p);
            if (!oe)
              return f.length = m, f;
            var Ae = ne(oe);
            try {
              f[m] = Ae;
            } catch (Fe) {
              try {
                ie(p);
              } finally {
                throw Fe;
              }
            }
            m++;
          }
        }
        function a(i, o, f) {
          var d = n(
            o,
            f,
            /*Create*/
            !1
          );
          if (s(d) || !d.delete(i))
            return !1;
          if (d.size === 0) {
            var v = t.get(o);
            s(v) || (v.delete(f), v.size === 0 && t.delete(v));
          }
          return !0;
        }
      }
      function Ce(e) {
        var t = e.defineMetadata, r = e.hasOwnMetadata, n = e.getOwnMetadata, u = e.getOwnMetadataKeys, M = e.deleteMetadata, _ = new U(), c = {
          isProviderFor: function(a, i) {
            var o = _.get(a);
            return !s(o) && o.has(i) ? !0 : u(a, i).length ? (s(o) && (o = new H(), _.set(a, o)), o.add(i), !0) : !1;
          },
          OrdinaryDefineOwnMetadata: t,
          OrdinaryHasOwnMetadata: r,
          OrdinaryGetOwnMetadata: n,
          OrdinaryOwnMetadataKeys: u,
          OrdinaryDeleteMetadata: M
        };
        return c;
      }
      function x(e, t, r) {
        var n = D.getProvider(e, t);
        if (!s(n))
          return n;
        if (r) {
          if (D.setProvider(e, t, z))
            return z;
          throw new Error("Illegal state.");
        }
      }
      function xe() {
        var e = {}, t = [], r = (
          /** @class */
          function() {
            function c(a, i, o) {
              this._index = 0, this._keys = a, this._values = i, this._selector = o;
            }
            return c.prototype["@@iterator"] = function() {
              return this;
            }, c.prototype[I] = function() {
              return this;
            }, c.prototype.next = function() {
              var a = this._index;
              if (a >= 0 && a < this._keys.length) {
                var i = this._selector(this._keys[a], this._values[a]);
                return a + 1 >= this._keys.length ? (this._index = -1, this._keys = t, this._values = t) : this._index++, { value: i, done: !1 };
              }
              return { value: void 0, done: !0 };
            }, c.prototype.throw = function(a) {
              throw this._index >= 0 && (this._index = -1, this._keys = t, this._values = t), a;
            }, c.prototype.return = function(a) {
              return this._index >= 0 && (this._index = -1, this._keys = t, this._values = t), { value: a, done: !0 };
            }, c;
          }()
        ), n = (
          /** @class */
          function() {
            function c() {
              this._keys = [], this._values = [], this._cacheKey = e, this._cacheIndex = -2;
            }
            return Object.defineProperty(c.prototype, "size", {
              get: function() {
                return this._keys.length;
              },
              enumerable: !0,
              configurable: !0
            }), c.prototype.has = function(a) {
              return this._find(
                a,
                /*insert*/
                !1
              ) >= 0;
            }, c.prototype.get = function(a) {
              var i = this._find(
                a,
                /*insert*/
                !1
              );
              return i >= 0 ? this._values[i] : void 0;
            }, c.prototype.set = function(a, i) {
              var o = this._find(
                a,
                /*insert*/
                !0
              );
              return this._values[o] = i, this;
            }, c.prototype.delete = function(a) {
              var i = this._find(
                a,
                /*insert*/
                !1
              );
              if (i >= 0) {
                for (var o = this._keys.length, f = i + 1; f < o; f++)
                  this._keys[f - 1] = this._keys[f], this._values[f - 1] = this._values[f];
                return this._keys.length--, this._values.length--, q(a, this._cacheKey) && (this._cacheKey = e, this._cacheIndex = -2), !0;
              }
              return !1;
            }, c.prototype.clear = function() {
              this._keys.length = 0, this._values.length = 0, this._cacheKey = e, this._cacheIndex = -2;
            }, c.prototype.keys = function() {
              return new r(this._keys, this._values, u);
            }, c.prototype.values = function() {
              return new r(this._keys, this._values, M);
            }, c.prototype.entries = function() {
              return new r(this._keys, this._values, _);
            }, c.prototype["@@iterator"] = function() {
              return this.entries();
            }, c.prototype[I] = function() {
              return this.entries();
            }, c.prototype._find = function(a, i) {
              if (!q(this._cacheKey, a)) {
                this._cacheIndex = -1;
                for (var o = 0; o < this._keys.length; o++)
                  if (q(this._keys[o], a)) {
                    this._cacheIndex = o;
                    break;
                  }
              }
              return this._cacheIndex < 0 && i && (this._cacheIndex = this._keys.length, this._keys.push(a), this._values.push(void 0)), this._cacheIndex;
            }, c;
          }()
        );
        return n;
        function u(c, a) {
          return c;
        }
        function M(c, a) {
          return a;
        }
        function _(c, a) {
          return [c, a];
        }
      }
      function Ge() {
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
      function De() {
        var e = 16, t = k.create(), r = n();
        return (
          /** @class */
          function() {
            function a() {
              this._key = n();
            }
            return a.prototype.has = function(i) {
              var o = u(
                i,
                /*create*/
                !1
              );
              return o !== void 0 ? k.has(o, this._key) : !1;
            }, a.prototype.get = function(i) {
              var o = u(
                i,
                /*create*/
                !1
              );
              return o !== void 0 ? k.get(o, this._key) : void 0;
            }, a.prototype.set = function(i, o) {
              var f = u(
                i,
                /*create*/
                !0
              );
              return f[this._key] = o, this;
            }, a.prototype.delete = function(i) {
              var o = u(
                i,
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
            a = "@@WeakMap@@" + c();
          while (k.has(t, a));
          return t[a] = !0, a;
        }
        function u(a, i) {
          if (!g.call(a, r)) {
            if (!i)
              return;
            Object.defineProperty(a, r, { value: k.create() });
          }
          return a[r];
        }
        function M(a, i) {
          for (var o = 0; o < i; ++o)
            a[o] = Math.random() * 255 | 0;
          return a;
        }
        function _(a) {
          if (typeof Uint8Array == "function") {
            var i = new Uint8Array(a);
            return typeof crypto < "u" ? crypto.getRandomValues(i) : typeof msCrypto < "u" ? msCrypto.getRandomValues(i) : M(i, a), i;
          }
          return M(new Array(a), a);
        }
        function c() {
          var a = _(e);
          a[6] = a[6] & 79 | 64, a[8] = a[8] & 191 | 128;
          for (var i = "", o = 0; o < e; ++o) {
            var f = a[o];
            (o === 4 || o === 6 || o === 8) && (i += "-"), f < 16 && (i += "0"), i += f.toString(16).toLowerCase();
          }
          return i;
        }
      }
      function V(e) {
        return e.__ = void 0, delete e.__, e;
      }
    });
  }(b || (b = {})), ue;
}
He();
function qe() {
  return (b) => {
    Reflect.defineMetadata("injectable", !0, b);
  };
}
function Ne(b) {
  return (y, l, h) => {
    Reflect.defineMetadata(
      "injection",
      b,
      y,
      `param:${h}`
    );
  };
}
const Ve = {
  IHttpConfig: Symbol("IHttpConfig"),
  IApiRequest: Symbol("IApiRequest"),
  IQuery: Symbol("IQuery"),
  IMutation: Symbol("IMutation")
};
var Ue = Object.defineProperty, We = (b, y, l) => y in b ? Ue(b, y, { enumerable: !0, configurable: !0, writable: !0, value: l }) : b[y] = l, ce = (b, y, l) => We(b, typeof y != "symbol" ? y + "" : y, l);
class de {
  static reset() {
    this.instances.clear(), this.bindings.clear();
  }
  static bind(y) {
    return {
      to: (l) => {
        this.bindings.set(y, l);
      },
      toInstance: (l) => {
        this.instances.set(y, l);
      }
    };
  }
  static resolve(y) {
    const l = this.instances.get(y);
    if (l !== void 0)
      return l;
    const h = this.bindings.get(y) ?? y;
    if (h == null)
      throw new Error(`No binding found for ${String(y)}`);
    const g = this.createInstance(h);
    return this.instances.set(h, g), g;
  }
  static createInstance(y) {
    const h = (Reflect.getMetadata("design:paramtypes", y) ?? []).map(
      (g) => this.resolve(g)
    );
    return new y(...h);
  }
}
ce(de, "instances", /* @__PURE__ */ new Map());
ce(de, "bindings", /* @__PURE__ */ new Map());
export {
  de as Container,
  Ne as Inject,
  qe as Injectable,
  Ve as TOKENS
};

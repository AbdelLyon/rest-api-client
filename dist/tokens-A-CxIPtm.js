var ue = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, oe = {};
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
function Ae() {
  if (se) return oe;
  se = 1;
  var m;
  return function(x) {
    (function(_) {
      var w = typeof globalThis == "object" ? globalThis : typeof ue == "object" ? ue : typeof self == "object" ? self : typeof this == "object" ? this : G(), O = k(x);
      typeof w.Reflect < "u" && (O = k(w.Reflect, O)), _(O, w), typeof w.Reflect > "u" && (w.Reflect = x);
      function k(I, S) {
        return function(g, j) {
          Object.defineProperty(I, g, { configurable: !0, writable: !0, value: j }), S && S(g, j);
        };
      }
      function H() {
        try {
          return Function("return this;")();
        } catch {
        }
      }
      function T() {
        try {
          return (0, eval)("(function() { return this; })()");
        } catch {
        }
      }
      function G() {
        return H() || T();
      }
    })(function(_, w) {
      var O = Object.prototype.hasOwnProperty, k = typeof Symbol == "function", H = k && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", T = k && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", G = typeof Object.create == "function", I = { __proto__: [] } instanceof Array, S = !G && !I, g = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: G ? function() {
          return z(/* @__PURE__ */ Object.create(null));
        } : I ? function() {
          return z({ __proto__: null });
        } : function() {
          return z({});
        },
        has: S ? function(e, t) {
          return O.call(e, t);
        } : function(e, t) {
          return t in e;
        },
        get: S ? function(e, t) {
          return O.call(e, t) ? e[t] : void 0;
        } : function(e, t) {
          return e[t];
        }
      }, j = Object.getPrototypeOf(Function), R = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : Re(), F = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : Ce(), U = typeof WeakMap == "function" ? WeakMap : xe(), E = k ? Symbol.for("@reflect-metadata:registry") : void 0, D = Pe(), B = Se(D);
      function ce(e, t, r, n) {
        if (s(r)) {
          if (!K(e))
            throw new TypeError();
          if (!ee(t))
            throw new TypeError();
          return be(e, t);
        } else {
          if (!K(e))
            throw new TypeError();
          if (!v(t))
            throw new TypeError();
          if (!v(n) && !s(n) && !P(n))
            throw new TypeError();
          return P(n) && (n = void 0), r = b(r), ge(e, t, r, n);
        }
      }
      _("decorate", ce);
      function de(e, t) {
        function r(n, o) {
          if (!v(n))
            throw new TypeError();
          if (!s(o) && !Ie(o))
            throw new TypeError();
          Z(e, t, n, o);
        }
        return r;
      }
      _("metadata", de);
      function le(e, t, r, n) {
        if (!v(r))
          throw new TypeError();
        return s(n) || (n = b(n)), Z(e, t, r, n);
      }
      _("defineMetadata", le);
      function he(e, t, r) {
        if (!v(t))
          throw new TypeError();
        return s(r) || (r = b(r)), N(e, t, r);
      }
      _("hasMetadata", he);
      function ve(e, t, r) {
        if (!v(t))
          throw new TypeError();
        return s(r) || (r = b(r)), W(e, t, r);
      }
      _("hasOwnMetadata", ve);
      function ye(e, t, r) {
        if (!v(t))
          throw new TypeError();
        return s(r) || (r = b(r)), L(e, t, r);
      }
      _("getMetadata", ye);
      function we(e, t, r) {
        if (!v(t))
          throw new TypeError();
        return s(r) || (r = b(r)), Q(e, t, r);
      }
      _("getOwnMetadata", we);
      function pe(e, t) {
        if (!v(e))
          throw new TypeError();
        return s(t) || (t = b(t)), $(e, t);
      }
      _("getMetadataKeys", pe);
      function _e(e, t) {
        if (!v(e))
          throw new TypeError();
        return s(t) || (t = b(t)), J(e, t);
      }
      _("getOwnMetadataKeys", _e);
      function Me(e, t, r) {
        if (!v(t))
          throw new TypeError();
        if (s(r) || (r = b(r)), !v(t))
          throw new TypeError();
        s(r) || (r = b(r));
        var n = C(
          t,
          r,
          /*Create*/
          !1
        );
        return s(n) ? !1 : n.OrdinaryDeleteMetadata(e, t, r);
      }
      _("deleteMetadata", Me);
      function be(e, t) {
        for (var r = e.length - 1; r >= 0; --r) {
          var n = e[r], o = n(t);
          if (!s(o) && !P(o)) {
            if (!ee(o))
              throw new TypeError();
            t = o;
          }
        }
        return t;
      }
      function ge(e, t, r, n) {
        for (var o = e.length - 1; o >= 0; --o) {
          var p = e[o], y = p(t, r, n);
          if (!s(y) && !P(y)) {
            if (!v(y))
              throw new TypeError();
            n = y;
          }
        }
        return n;
      }
      function N(e, t, r) {
        var n = W(e, t, r);
        if (n)
          return !0;
        var o = q(t);
        return P(o) ? !1 : N(e, o, r);
      }
      function W(e, t, r) {
        var n = C(
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
        var o = q(t);
        if (!P(o))
          return L(e, o, r);
      }
      function Q(e, t, r) {
        var n = C(
          t,
          r,
          /*Create*/
          !1
        );
        if (!s(n))
          return n.OrdinaryGetOwnMetadata(e, t, r);
      }
      function Z(e, t, r, n) {
        var o = C(
          r,
          n,
          /*Create*/
          !0
        );
        o.OrdinaryDefineOwnMetadata(e, t, r, n);
      }
      function $(e, t) {
        var r = J(e, t), n = q(e);
        if (n === null)
          return r;
        var o = $(n, t);
        if (o.length <= 0)
          return r;
        if (r.length <= 0)
          return o;
        for (var p = new F(), y = [], c = 0, a = r; c < a.length; c++) {
          var i = a[c], f = p.has(i);
          f || (p.add(i), y.push(i));
        }
        for (var u = 0, d = o; u < d.length; u++) {
          var i = d[u], f = p.has(i);
          f || (p.add(i), y.push(i));
        }
        return y;
      }
      function J(e, t) {
        var r = C(
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
      function P(e) {
        return e === null;
      }
      function Oe(e) {
        return typeof e == "symbol";
      }
      function v(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      }
      function me(e, t) {
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
        var r = "string", n = te(e, H);
        if (n !== void 0) {
          var o = n.call(e, r);
          if (v(o))
            throw new TypeError();
          return o;
        }
        return ke(e);
      }
      function ke(e, t) {
        var r, n;
        {
          var o = e.toString;
          if (A(o)) {
            var n = o.call(e);
            if (!v(n))
              return n;
          }
          var r = e.valueOf;
          if (A(r)) {
            var n = r.call(e);
            if (!v(n))
              return n;
          }
        }
        throw new TypeError();
      }
      function Y(e) {
        return !!e;
      }
      function Te(e) {
        return "" + e;
      }
      function b(e) {
        var t = me(e);
        return Oe(t) ? t : Te(t);
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
      function Ie(e) {
        switch (X(e)) {
          case 3:
            return !0;
          case 4:
            return !0;
          default:
            return !1;
        }
      }
      function V(e, t) {
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
        var t = te(e, T);
        if (!A(t))
          throw new TypeError();
        var r = t.call(e);
        if (!v(r))
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
      function q(e) {
        var t = Object.getPrototypeOf(e);
        if (typeof e != "function" || e === j || t !== j)
          return t;
        var r = e.prototype, n = r && Object.getPrototypeOf(r);
        if (n == null || n === Object.prototype)
          return t;
        var o = n.constructor;
        return typeof o != "function" || o === e ? t : o;
      }
      function Ee() {
        var e;
        !s(E) && typeof w.Reflect < "u" && !(E in w.Reflect) && typeof w.Reflect.defineMetadata == "function" && (e = je(w.Reflect));
        var t, r, n, o = new U(), p = {
          registerProvider: y,
          getProvider: a,
          setProvider: f
        };
        return p;
        function y(u) {
          if (!Object.isExtensible(p))
            throw new Error("Cannot add provider to a frozen registry.");
          switch (!0) {
            case e === u:
              break;
            case s(t):
              t = u;
              break;
            case t === u:
              break;
            case s(r):
              r = u;
              break;
            case r === u:
              break;
            default:
              n === void 0 && (n = new F()), n.add(u);
              break;
          }
        }
        function c(u, d) {
          if (!s(t)) {
            if (t.isProviderFor(u, d))
              return t;
            if (!s(r)) {
              if (r.isProviderFor(u, d))
                return t;
              if (!s(n))
                for (var l = re(n); ; ) {
                  var h = ae(l);
                  if (!h)
                    return;
                  var M = ne(h);
                  if (M.isProviderFor(u, d))
                    return ie(l), M;
                }
            }
          }
          if (!s(e) && e.isProviderFor(u, d))
            return e;
        }
        function a(u, d) {
          var l = o.get(u), h;
          return s(l) || (h = l.get(d)), s(h) && (h = c(u, d), s(h) || (s(l) && (l = new R(), o.set(u, l)), l.set(d, h))), h;
        }
        function i(u) {
          if (s(u))
            throw new TypeError();
          return t === u || r === u || !s(n) && n.has(u);
        }
        function f(u, d, l) {
          if (!i(l))
            throw new Error("Metadata provider not registered.");
          var h = a(u, d);
          if (h !== l) {
            if (!s(h))
              return !1;
            var M = o.get(u);
            s(M) && (M = new R(), o.set(u, M)), M.set(d, l);
          }
          return !0;
        }
      }
      function Pe() {
        var e;
        return !s(E) && v(w.Reflect) && Object.isExtensible(w.Reflect) && (e = w.Reflect[E]), s(e) && (e = Ee()), !s(E) && v(w.Reflect) && Object.isExtensible(w.Reflect) && Object.defineProperty(w.Reflect, E, {
          enumerable: !1,
          configurable: !1,
          writable: !1,
          value: e
        }), e;
      }
      function Se(e) {
        var t = new U(), r = {
          isProviderFor: function(i, f) {
            var u = t.get(i);
            return s(u) ? !1 : u.has(f);
          },
          OrdinaryDefineOwnMetadata: y,
          OrdinaryHasOwnMetadata: o,
          OrdinaryGetOwnMetadata: p,
          OrdinaryOwnMetadataKeys: c,
          OrdinaryDeleteMetadata: a
        };
        return D.registerProvider(r), r;
        function n(i, f, u) {
          var d = t.get(i), l = !1;
          if (s(d)) {
            if (!u)
              return;
            d = new R(), t.set(i, d), l = !0;
          }
          var h = d.get(f);
          if (s(h)) {
            if (!u)
              return;
            if (h = new R(), d.set(f, h), !e.setProvider(i, f, r))
              throw d.delete(f), l && t.delete(i), new Error("Wrong provider for target.");
          }
          return h;
        }
        function o(i, f, u) {
          var d = n(
            f,
            u,
            /*Create*/
            !1
          );
          return s(d) ? !1 : Y(d.has(i));
        }
        function p(i, f, u) {
          var d = n(
            f,
            u,
            /*Create*/
            !1
          );
          if (!s(d))
            return d.get(i);
        }
        function y(i, f, u, d) {
          var l = n(
            u,
            d,
            /*Create*/
            !0
          );
          l.set(i, f);
        }
        function c(i, f) {
          var u = [], d = n(
            i,
            f,
            /*Create*/
            !1
          );
          if (s(d))
            return u;
          for (var l = d.keys(), h = re(l), M = 0; ; ) {
            var fe = ae(h);
            if (!fe)
              return u.length = M, u;
            var Ge = ne(fe);
            try {
              u[M] = Ge;
            } catch (De) {
              try {
                ie(h);
              } finally {
                throw De;
              }
            }
            M++;
          }
        }
        function a(i, f, u) {
          var d = n(
            f,
            u,
            /*Create*/
            !1
          );
          if (s(d) || !d.delete(i))
            return !1;
          if (d.size === 0) {
            var l = t.get(f);
            s(l) || (l.delete(u), l.size === 0 && t.delete(l));
          }
          return !0;
        }
      }
      function je(e) {
        var t = e.defineMetadata, r = e.hasOwnMetadata, n = e.getOwnMetadata, o = e.getOwnMetadataKeys, p = e.deleteMetadata, y = new U(), c = {
          isProviderFor: function(a, i) {
            var f = y.get(a);
            return !s(f) && f.has(i) ? !0 : o(a, i).length ? (s(f) && (f = new F(), y.set(a, f)), f.add(i), !0) : !1;
          },
          OrdinaryDefineOwnMetadata: t,
          OrdinaryHasOwnMetadata: r,
          OrdinaryGetOwnMetadata: n,
          OrdinaryOwnMetadataKeys: o,
          OrdinaryDeleteMetadata: p
        };
        return c;
      }
      function C(e, t, r) {
        var n = D.getProvider(e, t);
        if (!s(n))
          return n;
        if (r) {
          if (D.setProvider(e, t, B))
            return B;
          throw new Error("Illegal state.");
        }
      }
      function Re() {
        var e = {}, t = [], r = (
          /** @class */
          function() {
            function c(a, i, f) {
              this._index = 0, this._keys = a, this._values = i, this._selector = f;
            }
            return c.prototype["@@iterator"] = function() {
              return this;
            }, c.prototype[T] = function() {
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
              var f = this._find(
                a,
                /*insert*/
                !0
              );
              return this._values[f] = i, this;
            }, c.prototype.delete = function(a) {
              var i = this._find(
                a,
                /*insert*/
                !1
              );
              if (i >= 0) {
                for (var f = this._keys.length, u = i + 1; u < f; u++)
                  this._keys[u - 1] = this._keys[u], this._values[u - 1] = this._values[u];
                return this._keys.length--, this._values.length--, V(a, this._cacheKey) && (this._cacheKey = e, this._cacheIndex = -2), !0;
              }
              return !1;
            }, c.prototype.clear = function() {
              this._keys.length = 0, this._values.length = 0, this._cacheKey = e, this._cacheIndex = -2;
            }, c.prototype.keys = function() {
              return new r(this._keys, this._values, o);
            }, c.prototype.values = function() {
              return new r(this._keys, this._values, p);
            }, c.prototype.entries = function() {
              return new r(this._keys, this._values, y);
            }, c.prototype["@@iterator"] = function() {
              return this.entries();
            }, c.prototype[T] = function() {
              return this.entries();
            }, c.prototype._find = function(a, i) {
              if (!V(this._cacheKey, a)) {
                this._cacheIndex = -1;
                for (var f = 0; f < this._keys.length; f++)
                  if (V(this._keys[f], a)) {
                    this._cacheIndex = f;
                    break;
                  }
              }
              return this._cacheIndex < 0 && i && (this._cacheIndex = this._keys.length, this._keys.push(a), this._values.push(void 0)), this._cacheIndex;
            }, c;
          }()
        );
        return n;
        function o(c, a) {
          return c;
        }
        function p(c, a) {
          return a;
        }
        function y(c, a) {
          return [c, a];
        }
      }
      function Ce() {
        var e = (
          /** @class */
          function() {
            function t() {
              this._map = new R();
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
            }, t.prototype[T] = function() {
              return this.keys();
            }, t;
          }()
        );
        return e;
      }
      function xe() {
        var e = 16, t = g.create(), r = n();
        return (
          /** @class */
          function() {
            function a() {
              this._key = n();
            }
            return a.prototype.has = function(i) {
              var f = o(
                i,
                /*create*/
                !1
              );
              return f !== void 0 ? g.has(f, this._key) : !1;
            }, a.prototype.get = function(i) {
              var f = o(
                i,
                /*create*/
                !1
              );
              return f !== void 0 ? g.get(f, this._key) : void 0;
            }, a.prototype.set = function(i, f) {
              var u = o(
                i,
                /*create*/
                !0
              );
              return u[this._key] = f, this;
            }, a.prototype.delete = function(i) {
              var f = o(
                i,
                /*create*/
                !1
              );
              return f !== void 0 ? delete f[this._key] : !1;
            }, a.prototype.clear = function() {
              this._key = n();
            }, a;
          }()
        );
        function n() {
          var a;
          do
            a = "@@WeakMap@@" + c();
          while (g.has(t, a));
          return t[a] = !0, a;
        }
        function o(a, i) {
          if (!O.call(a, r)) {
            if (!i)
              return;
            Object.defineProperty(a, r, { value: g.create() });
          }
          return a[r];
        }
        function p(a, i) {
          for (var f = 0; f < i; ++f)
            a[f] = Math.random() * 255 | 0;
          return a;
        }
        function y(a) {
          if (typeof Uint8Array == "function") {
            var i = new Uint8Array(a);
            return typeof crypto < "u" ? crypto.getRandomValues(i) : typeof msCrypto < "u" ? msCrypto.getRandomValues(i) : p(i, a), i;
          }
          return p(new Array(a), a);
        }
        function c() {
          var a = y(e);
          a[6] = a[6] & 79 | 64, a[8] = a[8] & 191 | 128;
          for (var i = "", f = 0; f < e; ++f) {
            var u = a[f];
            (f === 4 || f === 6 || f === 8) && (i += "-"), u < 16 && (i += "0"), i += u.toString(16).toLowerCase();
          }
          return i;
        }
      }
      function z(e) {
        return e.__ = void 0, delete e.__, e;
      }
    });
  }(m || (m = {})), oe;
}
Ae();
function He() {
  return (m) => {
    Reflect.defineMetadata("injectable", !0, m);
  };
}
function Fe(m) {
  return (x, _, w) => {
    Reflect.defineMetadata(
      "injection",
      m,
      x,
      `param:${w}`
    );
  };
}
const Ue = {
  IHttpConfig: Symbol("IHttpConfig"),
  IHttp: Symbol("IHttp"),
  IQuery: Symbol("IQuery"),
  IMutation: Symbol("IMutation")
};
export {
  He as I,
  Ue as T,
  Fe as a
};

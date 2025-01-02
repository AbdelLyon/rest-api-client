import le from "axios";
import W from "axios-retry";
import { getCookie as Ye, setCookie as he, deleteCookie as ve } from "cookies-next";
var ye = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ke = Object.defineProperty, et = (f, a, d) => a in f ? Ke(f, a, { enumerable: !0, configurable: !0, writable: !0, value: d }) : f[a] = d, B = (f, a, d) => et(f, typeof a != "symbol" ? a + "" : a, d);
class tt {
  constructor(a) {
    B(this, "axiosInstance"), B(this, "isRefreshing", !1), B(this, "refreshTokenPromise", null), B(this, "MAX_RETRIES", 3), this.axiosInstance = this.createInstance(a), this.initializeRetry(), this.setupInterceptors();
  }
  createInstance(a) {
    return le.create({
      baseURL: a,
      timeout: 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      withCredentials: !0
    });
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      this.addAuthorizationHeader,
      (a) => Promise.reject(a)
    ), this.axiosInstance.interceptors.response.use(
      (a) => a,
      this.handleResponseError.bind(this)
    );
  }
  addAuthorizationHeader(a) {
    const d = Ye("jwt");
    return d && a.headers && (a.headers.Authorization = `Bearer ${d}`), a;
  }
  async handleResponseError(a) {
    const d = a.config;
    if (d._retry || !a.response)
      return Promise.reject(a);
    if (a.response.status === 401 && !this.isRefreshing) {
      d._retry = !0;
      try {
        return await this.handleTokenRefresh(), this.axiosInstance(d);
      } catch (y) {
        return this.handleAuthenticationFailure(), Promise.reject(y);
      }
    }
    return Promise.reject(a);
  }
  async handleTokenRefresh() {
    return this.refreshTokenPromise || (this.isRefreshing = !0, this.refreshTokenPromise = this.refreshToken().finally(() => {
      this.isRefreshing = !1, this.refreshTokenPromise = null;
    })), this.refreshTokenPromise;
  }
  async refreshToken() {
    var a, d;
    try {
      const y = await le.post(
        `${this.axiosInstance.defaults.baseURL}/refresh-token`,
        {},
        { withCredentials: !0 }
      );
      if (!((d = (a = y.data) == null ? void 0 : a.token) != null && d.access_token))
        throw new Error("Invalid token refresh response");
      this.updateTokens(y.data.token);
    } catch (y) {
      throw this.clearTokens(), y;
    }
  }
  updateTokens(a) {
    he("jwt", a.access_token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    }), a.refresh_token && he("refresh_token", a.refresh_token, {
      maxAge: 60 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: !0
    });
  }
  clearTokens() {
    ve("jwt"), ve("refresh_token");
  }
  handleAuthenticationFailure() {
    this.clearTokens(), typeof window < "u" && (window.location.href = "/");
  }
  initializeRetry() {
    W(this.axiosInstance, {
      retries: this.MAX_RETRIES,
      retryDelay: W.exponentialDelay,
      retryCondition: (a) => {
        var d;
        return W.isNetworkOrIdempotentRequestError(a) || ((d = a.response) == null ? void 0 : d.status) === 429;
      }
    });
  }
}
var pe = {};
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
var we;
function rt() {
  if (we) return pe;
  we = 1;
  var f;
  return function(a) {
    (function(d) {
      var y = typeof globalThis == "object" ? globalThis : typeof ye == "object" ? ye : typeof self == "object" ? self : typeof this == "object" ? this : x(), w = g(a);
      typeof y.Reflect < "u" && (w = g(y.Reflect, w)), d(w, y), typeof y.Reflect > "u" && (y.Reflect = a);
      function g(O, S) {
        return function(k, j) {
          Object.defineProperty(O, k, { configurable: !0, writable: !0, value: j }), S && S(k, j);
        };
      }
      function E() {
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
      function x() {
        return E() || R();
      }
    })(function(d, y) {
      var w = Object.prototype.hasOwnProperty, g = typeof Symbol == "function", E = g && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", R = g && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", x = typeof Object.create == "function", O = { __proto__: [] } instanceof Array, S = !x && !O, k = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: x ? function() {
          return V(/* @__PURE__ */ Object.create(null));
        } : O ? function() {
          return V({ __proto__: null });
        } : function() {
          return V({});
        },
        has: S ? function(e, t) {
          return w.call(e, t);
        } : function(e, t) {
          return t in e;
        },
        get: S ? function(e, t) {
          return w.call(e, t) ? e[t] : void 0;
        } : function(e, t) {
          return e[t];
        }
      }, j = Object.getPrototypeOf(Function), I = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : Le(), A = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : Xe(), N = typeof WeakMap == "function" ? WeakMap : Ze(), C = g ? Symbol.for("@reflect-metadata:registry") : void 0, G = Ve(), Z = We(G);
      function Pe(e, t, r, n) {
        if (l(r)) {
          if (!ae(e))
            throw new TypeError();
          if (!ie(t))
            throw new TypeError();
          return Fe(e, t);
        } else {
          if (!ae(e))
            throw new TypeError();
          if (!m(t))
            throw new TypeError();
          if (!m(n) && !l(n) && !D(n))
            throw new TypeError();
          return D(n) && (n = void 0), r = P(r), Ge(e, t, r, n);
        }
      }
      d("decorate", Pe);
      function Ee(e, t) {
        function r(n, c) {
          if (!m(n))
            throw new TypeError();
          if (!l(c) && !He(c))
            throw new TypeError();
          K(e, t, n, c);
        }
        return r;
      }
      d("metadata", Ee);
      function Re(e, t, r, n) {
        if (!m(r))
          throw new TypeError();
        return l(n) || (n = P(n)), K(e, t, r, n);
      }
      d("defineMetadata", Re);
      function Ie(e, t, r) {
        if (!m(t))
          throw new TypeError();
        return l(r) || (r = P(r)), J(e, t, r);
      }
      d("hasMetadata", Ie);
      function Se(e, t, r) {
        if (!m(t))
          throw new TypeError();
        return l(r) || (r = P(r)), q(e, t, r);
      }
      d("hasOwnMetadata", Se);
      function xe(e, t, r) {
        if (!m(t))
          throw new TypeError();
        return l(r) || (r = P(r)), Q(e, t, r);
      }
      d("getMetadata", xe);
      function je(e, t, r) {
        if (!m(t))
          throw new TypeError();
        return l(r) || (r = P(r)), Y(e, t, r);
      }
      d("getOwnMetadata", je);
      function Ae(e, t) {
        if (!m(e))
          throw new TypeError();
        return l(t) || (t = P(t)), ee(e, t);
      }
      d("getMetadataKeys", Ae);
      function Ce(e, t) {
        if (!m(e))
          throw new TypeError();
        return l(t) || (t = P(t)), te(e, t);
      }
      d("getOwnMetadataKeys", Ce);
      function De(e, t, r) {
        if (!m(t))
          throw new TypeError();
        if (l(r) || (r = P(r)), !m(t))
          throw new TypeError();
        l(r) || (r = P(r));
        var n = F(
          t,
          r,
          /*Create*/
          !1
        );
        return l(n) ? !1 : n.OrdinaryDeleteMetadata(e, t, r);
      }
      d("deleteMetadata", De);
      function Fe(e, t) {
        for (var r = e.length - 1; r >= 0; --r) {
          var n = e[r], c = n(t);
          if (!l(c) && !D(c)) {
            if (!ie(c))
              throw new TypeError();
            t = c;
          }
        }
        return t;
      }
      function Ge(e, t, r, n) {
        for (var c = e.length - 1; c >= 0; --c) {
          var b = e[c], M = b(t, r, n);
          if (!l(M) && !D(M)) {
            if (!m(M))
              throw new TypeError();
            n = M;
          }
        }
        return n;
      }
      function J(e, t, r) {
        var n = q(e, t, r);
        if (n)
          return !0;
        var c = U(t);
        return D(c) ? !1 : J(e, c, r);
      }
      function q(e, t, r) {
        var n = F(
          t,
          r,
          /*Create*/
          !1
        );
        return l(n) ? !1 : ne(n.OrdinaryHasOwnMetadata(e, t, r));
      }
      function Q(e, t, r) {
        var n = q(e, t, r);
        if (n)
          return Y(e, t, r);
        var c = U(t);
        if (!D(c))
          return Q(e, c, r);
      }
      function Y(e, t, r) {
        var n = F(
          t,
          r,
          /*Create*/
          !1
        );
        if (!l(n))
          return n.OrdinaryGetOwnMetadata(e, t, r);
      }
      function K(e, t, r, n) {
        var c = F(
          r,
          n,
          /*Create*/
          !0
        );
        c.OrdinaryDefineOwnMetadata(e, t, r, n);
      }
      function ee(e, t) {
        var r = te(e, t), n = U(e);
        if (n === null)
          return r;
        var c = ee(n, t);
        if (c.length <= 0)
          return r;
        if (r.length <= 0)
          return c;
        for (var b = new A(), M = [], h = 0, i = r; h < i.length; h++) {
          var o = i[h], s = b.has(o);
          s || (b.add(o), M.push(o));
        }
        for (var u = 0, v = c; u < v.length; u++) {
          var o = v[u], s = b.has(o);
          s || (b.add(o), M.push(o));
        }
        return M;
      }
      function te(e, t) {
        var r = F(
          e,
          t,
          /*create*/
          !1
        );
        return r ? r.OrdinaryOwnMetadataKeys(e, t) : [];
      }
      function re(e) {
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
      function l(e) {
        return e === void 0;
      }
      function D(e) {
        return e === null;
      }
      function ze(e) {
        return typeof e == "symbol";
      }
      function m(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      }
      function Be(e, t) {
        switch (re(e)) {
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
        var r = "string", n = oe(e, E);
        if (n !== void 0) {
          var c = n.call(e, r);
          if (m(c))
            throw new TypeError();
          return c;
        }
        return Ne(e);
      }
      function Ne(e, t) {
        var r, n;
        {
          var c = e.toString;
          if (z(c)) {
            var n = c.call(e);
            if (!m(n))
              return n;
          }
          var r = e.valueOf;
          if (z(r)) {
            var n = r.call(e);
            if (!m(n))
              return n;
          }
        }
        throw new TypeError();
      }
      function ne(e) {
        return !!e;
      }
      function qe(e) {
        return "" + e;
      }
      function P(e) {
        var t = Be(e);
        return ze(t) ? t : qe(t);
      }
      function ae(e) {
        return Array.isArray ? Array.isArray(e) : e instanceof Object ? e instanceof Array : Object.prototype.toString.call(e) === "[object Array]";
      }
      function z(e) {
        return typeof e == "function";
      }
      function ie(e) {
        return typeof e == "function";
      }
      function He(e) {
        switch (re(e)) {
          case 3:
            return !0;
          case 4:
            return !0;
          default:
            return !1;
        }
      }
      function H(e, t) {
        return e === t || e !== e && t !== t;
      }
      function oe(e, t) {
        var r = e[t];
        if (r != null) {
          if (!z(r))
            throw new TypeError();
          return r;
        }
      }
      function se(e) {
        var t = oe(e, R);
        if (!z(t))
          throw new TypeError();
        var r = t.call(e);
        if (!m(r))
          throw new TypeError();
        return r;
      }
      function ue(e) {
        return e.value;
      }
      function fe(e) {
        var t = e.next();
        return t.done ? !1 : t;
      }
      function ce(e) {
        var t = e.return;
        t && t.call(e);
      }
      function U(e) {
        var t = Object.getPrototypeOf(e);
        if (typeof e != "function" || e === j || t !== j)
          return t;
        var r = e.prototype, n = r && Object.getPrototypeOf(r);
        if (n == null || n === Object.prototype)
          return t;
        var c = n.constructor;
        return typeof c != "function" || c === e ? t : c;
      }
      function Ue() {
        var e;
        !l(C) && typeof y.Reflect < "u" && !(C in y.Reflect) && typeof y.Reflect.defineMetadata == "function" && (e = $e(y.Reflect));
        var t, r, n, c = new N(), b = {
          registerProvider: M,
          getProvider: i,
          setProvider: s
        };
        return b;
        function M(u) {
          if (!Object.isExtensible(b))
            throw new Error("Cannot add provider to a frozen registry.");
          switch (!0) {
            case e === u:
              break;
            case l(t):
              t = u;
              break;
            case t === u:
              break;
            case l(r):
              r = u;
              break;
            case r === u:
              break;
            default:
              n === void 0 && (n = new A()), n.add(u);
              break;
          }
        }
        function h(u, v) {
          if (!l(t)) {
            if (t.isProviderFor(u, v))
              return t;
            if (!l(r)) {
              if (r.isProviderFor(u, v))
                return t;
              if (!l(n))
                for (var p = se(n); ; ) {
                  var _ = fe(p);
                  if (!_)
                    return;
                  var T = ue(_);
                  if (T.isProviderFor(u, v))
                    return ce(p), T;
                }
            }
          }
          if (!l(e) && e.isProviderFor(u, v))
            return e;
        }
        function i(u, v) {
          var p = c.get(u), _;
          return l(p) || (_ = p.get(v)), l(_) && (_ = h(u, v), l(_) || (l(p) && (p = new I(), c.set(u, p)), p.set(v, _))), _;
        }
        function o(u) {
          if (l(u))
            throw new TypeError();
          return t === u || r === u || !l(n) && n.has(u);
        }
        function s(u, v, p) {
          if (!o(p))
            throw new Error("Metadata provider not registered.");
          var _ = i(u, v);
          if (_ !== p) {
            if (!l(_))
              return !1;
            var T = c.get(u);
            l(T) && (T = new I(), c.set(u, T)), T.set(v, p);
          }
          return !0;
        }
      }
      function Ve() {
        var e;
        return !l(C) && m(y.Reflect) && Object.isExtensible(y.Reflect) && (e = y.Reflect[C]), l(e) && (e = Ue()), !l(C) && m(y.Reflect) && Object.isExtensible(y.Reflect) && Object.defineProperty(y.Reflect, C, {
          enumerable: !1,
          configurable: !1,
          writable: !1,
          value: e
        }), e;
      }
      function We(e) {
        var t = new N(), r = {
          isProviderFor: function(o, s) {
            var u = t.get(o);
            return l(u) ? !1 : u.has(s);
          },
          OrdinaryDefineOwnMetadata: M,
          OrdinaryHasOwnMetadata: c,
          OrdinaryGetOwnMetadata: b,
          OrdinaryOwnMetadataKeys: h,
          OrdinaryDeleteMetadata: i
        };
        return G.registerProvider(r), r;
        function n(o, s, u) {
          var v = t.get(o), p = !1;
          if (l(v)) {
            if (!u)
              return;
            v = new I(), t.set(o, v), p = !0;
          }
          var _ = v.get(s);
          if (l(_)) {
            if (!u)
              return;
            if (_ = new I(), v.set(s, _), !e.setProvider(o, s, r))
              throw v.delete(s), p && t.delete(o), new Error("Wrong provider for target.");
          }
          return _;
        }
        function c(o, s, u) {
          var v = n(
            s,
            u,
            /*Create*/
            !1
          );
          return l(v) ? !1 : ne(v.has(o));
        }
        function b(o, s, u) {
          var v = n(
            s,
            u,
            /*Create*/
            !1
          );
          if (!l(v))
            return v.get(o);
        }
        function M(o, s, u, v) {
          var p = n(
            u,
            v,
            /*Create*/
            !0
          );
          p.set(o, s);
        }
        function h(o, s) {
          var u = [], v = n(
            o,
            s,
            /*Create*/
            !1
          );
          if (l(v))
            return u;
          for (var p = v.keys(), _ = se(p), T = 0; ; ) {
            var de = fe(_);
            if (!de)
              return u.length = T, u;
            var Je = ue(de);
            try {
              u[T] = Je;
            } catch (Qe) {
              try {
                ce(_);
              } finally {
                throw Qe;
              }
            }
            T++;
          }
        }
        function i(o, s, u) {
          var v = n(
            s,
            u,
            /*Create*/
            !1
          );
          if (l(v) || !v.delete(o))
            return !1;
          if (v.size === 0) {
            var p = t.get(s);
            l(p) || (p.delete(u), p.size === 0 && t.delete(p));
          }
          return !0;
        }
      }
      function $e(e) {
        var t = e.defineMetadata, r = e.hasOwnMetadata, n = e.getOwnMetadata, c = e.getOwnMetadataKeys, b = e.deleteMetadata, M = new N(), h = {
          isProviderFor: function(i, o) {
            var s = M.get(i);
            return !l(s) && s.has(o) ? !0 : c(i, o).length ? (l(s) && (s = new A(), M.set(i, s)), s.add(o), !0) : !1;
          },
          OrdinaryDefineOwnMetadata: t,
          OrdinaryHasOwnMetadata: r,
          OrdinaryGetOwnMetadata: n,
          OrdinaryOwnMetadataKeys: c,
          OrdinaryDeleteMetadata: b
        };
        return h;
      }
      function F(e, t, r) {
        var n = G.getProvider(e, t);
        if (!l(n))
          return n;
        if (r) {
          if (G.setProvider(e, t, Z))
            return Z;
          throw new Error("Illegal state.");
        }
      }
      function Le() {
        var e = {}, t = [], r = (
          /** @class */
          function() {
            function h(i, o, s) {
              this._index = 0, this._keys = i, this._values = o, this._selector = s;
            }
            return h.prototype["@@iterator"] = function() {
              return this;
            }, h.prototype[R] = function() {
              return this;
            }, h.prototype.next = function() {
              var i = this._index;
              if (i >= 0 && i < this._keys.length) {
                var o = this._selector(this._keys[i], this._values[i]);
                return i + 1 >= this._keys.length ? (this._index = -1, this._keys = t, this._values = t) : this._index++, { value: o, done: !1 };
              }
              return { value: void 0, done: !0 };
            }, h.prototype.throw = function(i) {
              throw this._index >= 0 && (this._index = -1, this._keys = t, this._values = t), i;
            }, h.prototype.return = function(i) {
              return this._index >= 0 && (this._index = -1, this._keys = t, this._values = t), { value: i, done: !0 };
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
            }), h.prototype.has = function(i) {
              return this._find(
                i,
                /*insert*/
                !1
              ) >= 0;
            }, h.prototype.get = function(i) {
              var o = this._find(
                i,
                /*insert*/
                !1
              );
              return o >= 0 ? this._values[o] : void 0;
            }, h.prototype.set = function(i, o) {
              var s = this._find(
                i,
                /*insert*/
                !0
              );
              return this._values[s] = o, this;
            }, h.prototype.delete = function(i) {
              var o = this._find(
                i,
                /*insert*/
                !1
              );
              if (o >= 0) {
                for (var s = this._keys.length, u = o + 1; u < s; u++)
                  this._keys[u - 1] = this._keys[u], this._values[u - 1] = this._values[u];
                return this._keys.length--, this._values.length--, H(i, this._cacheKey) && (this._cacheKey = e, this._cacheIndex = -2), !0;
              }
              return !1;
            }, h.prototype.clear = function() {
              this._keys.length = 0, this._values.length = 0, this._cacheKey = e, this._cacheIndex = -2;
            }, h.prototype.keys = function() {
              return new r(this._keys, this._values, c);
            }, h.prototype.values = function() {
              return new r(this._keys, this._values, b);
            }, h.prototype.entries = function() {
              return new r(this._keys, this._values, M);
            }, h.prototype["@@iterator"] = function() {
              return this.entries();
            }, h.prototype[R] = function() {
              return this.entries();
            }, h.prototype._find = function(i, o) {
              if (!H(this._cacheKey, i)) {
                this._cacheIndex = -1;
                for (var s = 0; s < this._keys.length; s++)
                  if (H(this._keys[s], i)) {
                    this._cacheIndex = s;
                    break;
                  }
              }
              return this._cacheIndex < 0 && o && (this._cacheIndex = this._keys.length, this._keys.push(i), this._values.push(void 0)), this._cacheIndex;
            }, h;
          }()
        );
        return n;
        function c(h, i) {
          return h;
        }
        function b(h, i) {
          return i;
        }
        function M(h, i) {
          return [h, i];
        }
      }
      function Xe() {
        var e = (
          /** @class */
          function() {
            function t() {
              this._map = new I();
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
      function Ze() {
        var e = 16, t = k.create(), r = n();
        return (
          /** @class */
          function() {
            function i() {
              this._key = n();
            }
            return i.prototype.has = function(o) {
              var s = c(
                o,
                /*create*/
                !1
              );
              return s !== void 0 ? k.has(s, this._key) : !1;
            }, i.prototype.get = function(o) {
              var s = c(
                o,
                /*create*/
                !1
              );
              return s !== void 0 ? k.get(s, this._key) : void 0;
            }, i.prototype.set = function(o, s) {
              var u = c(
                o,
                /*create*/
                !0
              );
              return u[this._key] = s, this;
            }, i.prototype.delete = function(o) {
              var s = c(
                o,
                /*create*/
                !1
              );
              return s !== void 0 ? delete s[this._key] : !1;
            }, i.prototype.clear = function() {
              this._key = n();
            }, i;
          }()
        );
        function n() {
          var i;
          do
            i = "@@WeakMap@@" + h();
          while (k.has(t, i));
          return t[i] = !0, i;
        }
        function c(i, o) {
          if (!w.call(i, r)) {
            if (!o)
              return;
            Object.defineProperty(i, r, { value: k.create() });
          }
          return i[r];
        }
        function b(i, o) {
          for (var s = 0; s < o; ++s)
            i[s] = Math.random() * 255 | 0;
          return i;
        }
        function M(i) {
          if (typeof Uint8Array == "function") {
            var o = new Uint8Array(i);
            return typeof crypto < "u" ? crypto.getRandomValues(o) : typeof msCrypto < "u" ? msCrypto.getRandomValues(o) : b(o, i), o;
          }
          return b(new Array(i), i);
        }
        function h() {
          var i = M(e);
          i[6] = i[6] & 79 | 64, i[8] = i[8] & 191 | 128;
          for (var o = "", s = 0; s < e; ++s) {
            var u = i[s];
            (s === 4 || s === 6 || s === 8) && (o += "-"), u < 16 && (o += "0"), o += u.toString(16).toLowerCase();
          }
          return o;
        }
      }
      function V(e) {
        return e.__ = void 0, delete e.__, e;
      }
    });
  }(f || (f = {})), pe;
}
rt();
const _e = "inversify:paramtypes", nt = "design:paramtypes";
var me;
(function(f) {
  f[f.MultipleBindingsAvailable = 2] = "MultipleBindingsAvailable", f[f.NoBindingsAvailable = 0] = "NoBindingsAvailable", f[f.OnlyOneBindingAvailable = 1] = "OnlyOneBindingAvailable";
})(me || (me = {}));
var Me;
(function(f) {
  f.DynamicValue = "toDynamicValue", f.Factory = "toFactory", f.Provider = "toProvider";
})(Me || (Me = {}));
function at() {
  return function(f) {
    if (Reflect.hasOwnMetadata(_e, f)) throw new Error("Cannot apply @injectable decorator multiple times.");
    const a = Reflect.getMetadata(nt, f) || [];
    return Reflect.defineMetadata(_e, a, f), f;
  };
}
var it = Object.create, L = Object.defineProperty, ot = Object.getOwnPropertyDescriptor, be = (f, a) => (a = Symbol[f]) ? a : Symbol.for("Symbol." + f), ge = (f) => {
  throw TypeError(f);
}, st = (f, a, d) => a in f ? L(f, a, { enumerable: !0, configurable: !0, writable: !0, value: d }) : f[a] = d, ut = (f, a) => L(f, "name", { value: a, configurable: !0 }), ft = (f) => [, , , it((f == null ? void 0 : f[be("metadata")]) ?? null)], ct = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"], Oe = (f) => f !== void 0 && typeof f != "function" ? ge("Function expected") : f, dt = (f, a, d, y, w) => ({ kind: ct[f], name: a, metadata: y, addInitializer: (g) => d._ ? ge("Already initialized") : w.push(Oe(g || null)) }), lt = (f, a) => st(a, be("metadata"), f[3]), ht = (f, a, d, y) => {
  for (var w = 0, g = f[a >> 1], E = g && g.length; w < E; w++) g[w].call(d);
  return y;
}, vt = (f, a, d, y, w, g) => {
  var E, R, x, O = a & 7, S = !!(a & 16), k = 0, j = f[k] || (f[k] = []), I = O && (w = w.prototype, O < 5 && (O > 3 || !S) && ot(w, d));
  ut(w, d);
  for (var A = y.length - 1; A >= 0; A--)
    x = dt(O, d, R = {}, f[3], j), E = (0, y[A])(w, x), R._ = 1, Oe(E) && (w = E);
  return lt(f, w), I && L(w, d, I), S ? O ^ 4 ? g : I : w;
}, ke, X, Te;
ke = [at()];
class $ extends (Te = tt) {
  constructor(a) {
    super(a);
  }
  async request(a) {
    try {
      return (await this.axiosInstance(a)).data;
    } catch (d) {
      throw console.error(
        `API Request failed: ${a.method} ${a.url}`,
        d
      ), d;
    }
  }
  async search(a) {
    return this.request({
      method: "POST",
      url: "/search",
      data: { search: a }
    });
  }
  async mutate(a) {
    return this.request({
      method: "POST",
      url: "/mutate",
      data: { mutate: a }
    });
  }
  async executeAction(a) {
    return this.request({
      method: "POST",
      url: `/actions/${a.action}`,
      data: a.params
    });
  }
}
X = ft(Te);
$ = vt(X, 0, "ApiService", ke, $);
ht(X, 1, $);
export {
  $ as ApiService,
  tt as HttpService
};

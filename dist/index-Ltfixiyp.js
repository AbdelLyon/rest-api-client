var tn = (e) => {
  throw TypeError(e);
};
var nn = (e, t, n) => t.has(e) || tn("Cannot " + n);
var y = (e, t, n) => (nn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), O = (e, t, n) => t.has(e) ? tn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), S = (e, t, n, r) => (nn(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
import * as B from "react";
import sr, { useState as or } from "react";
import { useQueryClient as wn, onlineManager as pn, QueryClient as ir, QueryClientProvider as lr } from "@tanstack/react-query";
var tt = { exports: {} }, Ie = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rn;
function ar() {
  if (rn) return Ie;
  rn = 1;
  var e = Symbol.for("react.transitional.element"), t = Symbol.for("react.fragment");
  function n(r, s, o) {
    var i = null;
    if (o !== void 0 && (i = "" + o), s.key !== void 0 && (i = "" + s.key), "key" in s) {
      o = {};
      for (var a in s)
        a !== "key" && (o[a] = s[a]);
    } else o = s;
    return s = o.ref, {
      $$typeof: e,
      type: r,
      key: i,
      ref: s !== void 0 ? s : null,
      props: o
    };
  }
  return Ie.Fragment = t, Ie.jsx = n, Ie.jsxs = n, Ie;
}
var je = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sn;
function ur() {
  return sn || (sn = 1, process.env.NODE_ENV !== "production" && function() {
    function e(l) {
      if (l == null) return null;
      if (typeof l == "function")
        return l.$$typeof === tr ? null : l.displayName || l.name || null;
      if (typeof l == "string") return l;
      switch (l) {
        case ee:
          return "Fragment";
        case L:
          return "Portal";
        case ce:
          return "Profiler";
        case ue:
          return "StrictMode";
        case z:
          return "Suspense";
        case wt:
          return "SuspenseList";
      }
      if (typeof l == "object")
        switch (typeof l.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), l.$$typeof) {
          case N:
            return (l.displayName || "Context") + ".Provider";
          case _:
            return (l._context.displayName || "Context") + ".Consumer";
          case C:
            var h = l.render;
            return l = l.displayName, l || (l = h.displayName || h.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
          case pt:
            return h = l.displayName || null, h !== null ? h : e(l.type) || "Memo";
          case bt:
            h = l._payload, l = l._init;
            try {
              return e(l(h));
            } catch {
            }
        }
      return null;
    }
    function t(l) {
      return "" + l;
    }
    function n(l) {
      try {
        t(l);
        var h = !1;
      } catch {
        h = !0;
      }
      if (h) {
        h = console;
        var g = h.error, b = typeof Symbol == "function" && Symbol.toStringTag && l[Symbol.toStringTag] || l.constructor.name || "Object";
        return g.call(
          h,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          b
        ), t(l);
      }
    }
    function r() {
    }
    function s() {
      if (Pe === 0) {
        Ft = console.log, Yt = console.info, zt = console.warn, Gt = console.error, Ht = console.group, Kt = console.groupCollapsed, Wt = console.groupEnd;
        var l = {
          configurable: !0,
          enumerable: !0,
          value: r,
          writable: !0
        };
        Object.defineProperties(console, {
          info: l,
          log: l,
          warn: l,
          error: l,
          group: l,
          groupCollapsed: l,
          groupEnd: l
        });
      }
      Pe++;
    }
    function o() {
      if (Pe--, Pe === 0) {
        var l = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: ne({}, l, { value: Ft }),
          info: ne({}, l, { value: Yt }),
          warn: ne({}, l, { value: zt }),
          error: ne({}, l, { value: Gt }),
          group: ne({}, l, { value: Ht }),
          groupCollapsed: ne({}, l, { value: Kt }),
          groupEnd: ne({}, l, { value: Wt })
        });
      }
      0 > Pe && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function i(l) {
      if (St === void 0)
        try {
          throw Error();
        } catch (g) {
          var h = g.stack.trim().match(/\n( *(at )?)/);
          St = h && h[1] || "", Qt = -1 < g.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < g.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + St + l + Qt;
    }
    function a(l, h) {
      if (!l || At) return "";
      var g = Ot.get(l);
      if (g !== void 0) return g;
      At = !0, g = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var b = null;
      b = te.H, te.H = null, s();
      try {
        var M = {
          DetermineComponentFrameRoot: function() {
            try {
              if (h) {
                var J = function() {
                  throw Error();
                };
                if (Object.defineProperty(J.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(J, []);
                  } catch (W) {
                    var et = W;
                  }
                  Reflect.construct(l, [], J);
                } else {
                  try {
                    J.call();
                  } catch (W) {
                    et = W;
                  }
                  l.call(J.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (W) {
                  et = W;
                }
                (J = l()) && typeof J.catch == "function" && J.catch(function() {
                });
              }
            } catch (W) {
              if (W && et && typeof W.stack == "string")
                return [W.stack, et.stack];
            }
            return [null, null];
          }
        };
        M.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var k = Object.getOwnPropertyDescriptor(
          M.DetermineComponentFrameRoot,
          "name"
        );
        k && k.configurable && Object.defineProperty(
          M.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var v = M.DetermineComponentFrameRoot(), K = v[0], fe = v[1];
        if (K && fe) {
          var D = K.split(`
`), re = fe.split(`
`);
          for (v = k = 0; k < D.length && !D[k].includes(
            "DetermineComponentFrameRoot"
          ); )
            k++;
          for (; v < re.length && !re[v].includes(
            "DetermineComponentFrameRoot"
          ); )
            v++;
          if (k === D.length || v === re.length)
            for (k = D.length - 1, v = re.length - 1; 1 <= k && 0 <= v && D[k] !== re[v]; )
              v--;
          for (; 1 <= k && 0 <= v; k--, v--)
            if (D[k] !== re[v]) {
              if (k !== 1 || v !== 1)
                do
                  if (k--, v--, 0 > v || D[k] !== re[v]) {
                    var _e = `
` + D[k].replace(
                      " at new ",
                      " at "
                    );
                    return l.displayName && _e.includes("<anonymous>") && (_e = _e.replace("<anonymous>", l.displayName)), typeof l == "function" && Ot.set(l, _e), _e;
                  }
                while (1 <= k && 0 <= v);
              break;
            }
        }
      } finally {
        At = !1, te.H = b, o(), Error.prepareStackTrace = g;
      }
      return D = (D = l ? l.displayName || l.name : "") ? i(D) : "", typeof l == "function" && Ot.set(l, D), D;
    }
    function u(l) {
      if (l == null) return "";
      if (typeof l == "function") {
        var h = l.prototype;
        return a(
          l,
          !(!h || !h.isReactComponent)
        );
      }
      if (typeof l == "string") return i(l);
      switch (l) {
        case z:
          return i("Suspense");
        case wt:
          return i("SuspenseList");
      }
      if (typeof l == "object")
        switch (l.$$typeof) {
          case C:
            return l = a(l.render, !1), l;
          case pt:
            return u(l.type);
          case bt:
            h = l._payload, l = l._init;
            try {
              return u(l(h));
            } catch {
            }
        }
      return "";
    }
    function c() {
      var l = te.A;
      return l === null ? null : l.getOwner();
    }
    function d(l) {
      if (qt.call(l, "key")) {
        var h = Object.getOwnPropertyDescriptor(l, "key").get;
        if (h && h.isReactWarning) return !1;
      }
      return l.key !== void 0;
    }
    function f(l, h) {
      function g() {
        Xt || (Xt = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          h
        ));
      }
      g.isReactWarning = !0, Object.defineProperty(l, "key", {
        get: g,
        configurable: !0
      });
    }
    function w() {
      var l = e(this.type);
      return Jt[l] || (Jt[l] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), l = this.props.ref, l !== void 0 ? l : null;
    }
    function p(l, h, g, b, M, k) {
      return g = k.ref, l = {
        $$typeof: j,
        type: l,
        key: h,
        props: k,
        _owner: M
      }, (g !== void 0 ? g : null) !== null ? Object.defineProperty(l, "ref", {
        enumerable: !1,
        get: w
      }) : Object.defineProperty(l, "ref", { enumerable: !1, value: null }), l._store = {}, Object.defineProperty(l._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(l, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.freeze && (Object.freeze(l.props), Object.freeze(l)), l;
    }
    function A(l, h, g, b, M, k) {
      if (typeof l == "string" || typeof l == "function" || l === ee || l === ce || l === ue || l === z || l === wt || l === er || typeof l == "object" && l !== null && (l.$$typeof === bt || l.$$typeof === pt || l.$$typeof === N || l.$$typeof === _ || l.$$typeof === C || l.$$typeof === nr || l.getModuleId !== void 0)) {
        var v = h.children;
        if (v !== void 0)
          if (b)
            if (Et(v)) {
              for (b = 0; b < v.length; b++)
                P(v[b], l);
              Object.freeze && Object.freeze(v);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else P(v, l);
      } else
        v = "", (l === void 0 || typeof l == "object" && l !== null && Object.keys(l).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), l === null ? b = "null" : Et(l) ? b = "array" : l !== void 0 && l.$$typeof === j ? (b = "<" + (e(l.type) || "Unknown") + " />", v = " Did you accidentally export a JSX literal instead of a component?") : b = typeof l, console.error(
          "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          b,
          v
        );
      if (qt.call(h, "key")) {
        v = e(l);
        var K = Object.keys(h).filter(function(D) {
          return D !== "key";
        });
        b = 0 < K.length ? "{key: someKey, " + K.join(": ..., ") + ": ...}" : "{key: someKey}", Zt[v + b] || (K = 0 < K.length ? "{" + K.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          b,
          v,
          K,
          v
        ), Zt[v + b] = !0);
      }
      if (v = null, g !== void 0 && (n(g), v = "" + g), d(h) && (n(h.key), v = "" + h.key), "key" in h) {
        g = {};
        for (var fe in h)
          fe !== "key" && (g[fe] = h[fe]);
      } else g = h;
      return v && f(
        g,
        typeof l == "function" ? l.displayName || l.name || "Unknown" : l
      ), p(l, v, k, M, c(), g);
    }
    function P(l, h) {
      if (typeof l == "object" && l && l.$$typeof !== rr) {
        if (Et(l))
          for (var g = 0; g < l.length; g++) {
            var b = l[g];
            F(b) && Y(b, h);
          }
        else if (F(l))
          l._store && (l._store.validated = 1);
        else if (l === null || typeof l != "object" ? g = null : (g = Bt && l[Bt] || l["@@iterator"], g = typeof g == "function" ? g : null), typeof g == "function" && g !== l.entries && (g = g.call(l), g !== l))
          for (; !(l = g.next()).done; )
            F(l.value) && Y(l.value, h);
      }
    }
    function F(l) {
      return typeof l == "object" && l !== null && l.$$typeof === j;
    }
    function Y(l, h) {
      if (l._store && !l._store.validated && l.key == null && (l._store.validated = 1, h = U(h), !en[h])) {
        en[h] = !0;
        var g = "";
        l && l._owner != null && l._owner !== c() && (g = null, typeof l._owner.tag == "number" ? g = e(l._owner.type) : typeof l._owner.name == "string" && (g = l._owner.name), g = " It was passed a child from " + g + ".");
        var b = te.getCurrentStack;
        te.getCurrentStack = function() {
          var M = u(l.type);
          return b && (M += b() || ""), M;
        }, console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          h,
          g
        ), te.getCurrentStack = b;
      }
    }
    function U(l) {
      var h = "", g = c();
      return g && (g = e(g.type)) && (h = `

Check the render method of \`` + g + "`."), h || (l = e(l)) && (h = `

Check the top-level render call using <` + l + ">."), h;
    }
    var V = sr, j = Symbol.for("react.transitional.element"), L = Symbol.for("react.portal"), ee = Symbol.for("react.fragment"), ue = Symbol.for("react.strict_mode"), ce = Symbol.for("react.profiler"), _ = Symbol.for("react.consumer"), N = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), z = Symbol.for("react.suspense"), wt = Symbol.for("react.suspense_list"), pt = Symbol.for("react.memo"), bt = Symbol.for("react.lazy"), er = Symbol.for("react.offscreen"), Bt = Symbol.iterator, tr = Symbol.for("react.client.reference"), te = V.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, qt = Object.prototype.hasOwnProperty, ne = Object.assign, nr = Symbol.for("react.client.reference"), Et = Array.isArray, Pe = 0, Ft, Yt, zt, Gt, Ht, Kt, Wt;
    r.__reactDisabledLog = !0;
    var St, Qt, At = !1, Ot = new (typeof WeakMap == "function" ? WeakMap : Map)(), rr = Symbol.for("react.client.reference"), Xt, Jt = {}, Zt = {}, en = {};
    je.Fragment = ee, je.jsx = function(l, h, g, b, M) {
      return A(l, h, g, !1, b, M);
    }, je.jsxs = function(l, h, g, b, M) {
      return A(l, h, g, !0, b, M);
    };
  }()), je;
}
var on;
function cr() {
  return on || (on = 1, process.env.NODE_ENV === "production" ? tt.exports = ar() : tt.exports = ur()), tt.exports;
}
var at = cr(), m = {
  context: void 0,
  registry: void 0,
  effects: void 0,
  done: !1,
  getContextId() {
    return ln(this.context.count);
  },
  getNextContextId() {
    return ln(this.context.count++);
  }
};
function ln(e) {
  const t = String(e), n = t.length - 1;
  return m.context.id + (n ? String.fromCharCode(96 + n) : "") + t;
}
function Me(e) {
  m.context = e;
}
var fr = (e, t) => e === t, ut = Symbol("solid-proxy"), bn = typeof Proxy == "function", En = Symbol("solid-track"), ct = {
  equals: fr
}, Sn = kn, X = 1, ft = 2, An = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
}, Tt = {}, E = null, xt = null, dr = null, T = null, $ = null, Q = null, yt = 0;
function ie(e, t) {
  const n = T, r = E, s = e.length === 0, o = t === void 0 ? r : t, i = s ? An : {
    owned: null,
    cleanups: null,
    context: o ? o.context : null,
    owner: o
  }, a = s ? e : () => e(() => I(() => De(i)));
  E = i, T = null;
  try {
    return H(a, !0);
  } finally {
    T = n, E = r;
  }
}
function R(e, t) {
  t = t ? Object.assign({}, ct, t) : ct;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (s) => (typeof s == "function" && (s = s(n.value)), Cn(n, s));
  return [xn.bind(n), r];
}
function hr(e, t, n) {
  const r = mt(e, t, !0, X);
  Re(r);
}
function le(e, t, n) {
  const r = mt(e, t, !1, X);
  Re(r);
}
function On(e, t, n) {
  Sn = Ar;
  const r = mt(e, t, !1, X);
  (!n || !n.render) && (r.user = !0), Q ? Q.push(r) : Re(r);
}
function q(e, t, n) {
  n = n ? Object.assign({}, ct, n) : ct;
  const r = mt(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, Re(r), xn.bind(r);
}
function gr(e) {
  return e && typeof e == "object" && "then" in e;
}
function yr(e, t, n) {
  let r, s, o;
  arguments.length === 1 ? (r = !0, s = e, o = {}) : (r = e, s = t, o = {});
  let i = null, a = Tt, u = null, c = !1, d = "initialValue" in o, f = typeof r == "function" && q(r);
  const w = /* @__PURE__ */ new Set(), [p, A] = (o.storage || R)(o.initialValue), [P, F] = R(void 0), [Y, U] = R(void 0, {
    equals: !1
  }), [V, j] = R(d ? "ready" : "unresolved");
  m.context && (u = m.getNextContextId(), o.ssrLoadFrom === "initial" ? a = o.initialValue : m.load && m.has(u) && (a = m.load(u)));
  function L(_, N, C, z) {
    return i === _ && (i = null, z !== void 0 && (d = !0), (_ === a || N === a) && o.onHydrated && queueMicrotask(
      () => o.onHydrated(z, {
        value: N
      })
    ), a = Tt, ee(N, C)), N;
  }
  function ee(_, N) {
    H(() => {
      N === void 0 && A(() => _), j(N !== void 0 ? "errored" : d ? "ready" : "unresolved"), F(N);
      for (const C of w.keys())
        C.decrement();
      w.clear();
    }, !1);
  }
  function ue() {
    const _ = br, N = p(), C = P();
    if (C !== void 0 && !i)
      throw C;
    return T && T.user, N;
  }
  function ce(_ = !0) {
    if (_ !== !1 && c)
      return;
    c = !1;
    const N = f ? f() : r;
    if (N == null || N === !1) {
      L(i, I(p));
      return;
    }
    const C = a !== Tt ? a : I(
      () => s(N, {
        value: p(),
        refetching: _
      })
    );
    return gr(C) ? (i = C, "value" in C ? (C.status === "success" ? L(i, C.value, void 0, N) : L(i, void 0, Nt(C.value), N), C) : (c = !0, queueMicrotask(() => c = !1), H(() => {
      j(d ? "refreshing" : "pending"), U();
    }, !1), C.then(
      (z) => L(C, z, void 0, N),
      (z) => L(C, void 0, Nt(z), N)
    ))) : (L(i, C, void 0, N), C);
  }
  return Object.defineProperties(ue, {
    state: {
      get: () => V()
    },
    error: {
      get: () => P()
    },
    loading: {
      get() {
        const _ = V();
        return _ === "pending" || _ === "refreshing";
      }
    },
    latest: {
      get() {
        if (!d)
          return ue();
        const _ = P();
        if (_ && !i)
          throw _;
        return p();
      }
    }
  }), f ? hr(() => ce(!1)) : ce(!1), [
    ue,
    {
      refetch: ce,
      mutate: A
    }
  ];
}
function Bs(e) {
  return H(e, !1);
}
function I(e) {
  if (T === null)
    return e();
  const t = T;
  T = null;
  try {
    return e();
  } finally {
    T = t;
  }
}
function qs(e, t, n) {
  const r = Array.isArray(e);
  let s, o = n && n.defer;
  return (i) => {
    let a;
    if (r) {
      a = Array(e.length);
      for (let c = 0; c < e.length; c++)
        a[c] = e[c]();
    } else
      a = e();
    if (o)
      return o = !1, i;
    const u = I(() => t(a, s, i));
    return s = a, u;
  };
}
function mr(e) {
  On(() => I(e));
}
function Le(e) {
  return E === null || (E.cleanups === null ? E.cleanups = [e] : E.cleanups.push(e)), e;
}
function an() {
  return E;
}
function vr(e, t) {
  const n = E, r = T;
  E = e, T = null;
  try {
    return H(t, !0);
  } catch (s) {
    Ut(s);
  } finally {
    E = n, T = r;
  }
}
function wr(e) {
  const t = T, n = E;
  return Promise.resolve().then(() => {
    T = t, E = n;
    let r;
    return H(e, !1), T = E = null, r ? r.done : void 0;
  });
}
var [pr, Fs] = /* @__PURE__ */ R(!1);
function Ys() {
  return [pr, wr];
}
function zs(e, t) {
  const n = Symbol("context");
  return {
    id: n,
    Provider: Or(n),
    defaultValue: e
  };
}
function Gs(e) {
  let t;
  return E && E.context && (t = E.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function Tn(e) {
  const t = q(e), n = q(() => Rt(t()));
  return n.toArray = () => {
    const r = n();
    return Array.isArray(r) ? r : r != null ? [r] : [];
  }, n;
}
var br;
function xn() {
  if (this.sources && this.state)
    if (this.state === X)
      Re(this);
    else {
      const e = $;
      $ = null, H(() => ht(this), !1), $ = e;
    }
  if (T) {
    const e = this.observers ? this.observers.length : 0;
    T.sources ? (T.sources.push(this), T.sourceSlots.push(e)) : (T.sources = [this], T.sourceSlots = [e]), this.observers ? (this.observers.push(T), this.observerSlots.push(T.sources.length - 1)) : (this.observers = [T], this.observerSlots = [T.sources.length - 1]);
  }
  return this.value;
}
function Cn(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && H(() => {
    for (let s = 0; s < e.observers.length; s += 1) {
      const o = e.observers[s], i = xt && xt.running;
      i && xt.disposed.has(o), (i ? !o.tState : !o.state) && (o.pure ? $.push(o) : Q.push(o), o.observers && Nn(o)), i || (o.state = X);
    }
    if ($.length > 1e6)
      throw $ = [], new Error();
  }, !1)), t;
}
function Re(e) {
  if (!e.fn)
    return;
  De(e);
  const t = yt;
  Er(
    e,
    e.value,
    t
  );
}
function Er(e, t, n) {
  let r;
  const s = E, o = T;
  T = E = e;
  try {
    r = e.fn(t);
  } catch (i) {
    return e.pure && (e.state = X, e.owned && e.owned.forEach(De), e.owned = null), e.updatedAt = n + 1, Ut(i);
  } finally {
    T = o, E = s;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? Cn(e, r) : e.value = r, e.updatedAt = n);
}
function mt(e, t, n, r = X, s) {
  const o = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: E,
    context: E ? E.context : null,
    pure: n
  };
  return E === null || E !== An && (E.owned ? E.owned.push(o) : E.owned = [o]), o;
}
function dt(e) {
  if (e.state === 0)
    return;
  if (e.state === ft)
    return ht(e);
  if (e.suspense && I(e.suspense.inFallback))
    return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < yt); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === X)
      Re(e);
    else if (e.state === ft) {
      const r = $;
      $ = null, H(() => ht(e, t[0]), !1), $ = r;
    }
}
function H(e, t) {
  if ($)
    return e();
  let n = !1;
  t || ($ = []), Q ? n = !0 : Q = [], yt++;
  try {
    const r = e();
    return Sr(n), r;
  } catch (r) {
    n || (Q = null), $ = null, Ut(r);
  }
}
function Sr(e) {
  if ($ && (kn($), $ = null), e)
    return;
  const t = Q;
  Q = null, t.length && H(() => Sn(t), !1);
}
function kn(e) {
  for (let t = 0; t < e.length; t++)
    dt(e[t]);
}
function Ar(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : dt(r);
  }
  if (m.context) {
    if (m.count) {
      m.effects || (m.effects = []), m.effects.push(...e.slice(0, n));
      return;
    }
    Me();
  }
  for (m.effects && (m.done || !m.count) && (e = [...m.effects, ...e], n += m.effects.length, delete m.effects), t = 0; t < n; t++)
    dt(e[t]);
}
function ht(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const s = r.state;
      s === X ? r !== t && (!r.updatedAt || r.updatedAt < yt) && dt(r) : s === ft && ht(r, t);
    }
  }
}
function Nn(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = ft, n.pure ? $.push(n) : Q.push(n), n.observers && Nn(n));
  }
}
function De(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), s = n.observers;
      if (s && s.length) {
        const o = s.pop(), i = n.observerSlots.pop();
        r < s.length && (o.sourceSlots[i] = r, s[r] = o, n.observerSlots[r] = i);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--)
      De(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--)
      De(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--)
      e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Nt(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function Ut(e, t = E) {
  throw Nt(e);
}
function Rt(e) {
  if (typeof e == "function" && !e.length)
    return Rt(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let n = 0; n < e.length; n++) {
      const r = Rt(e[n]);
      Array.isArray(r) ? t.push.apply(t, r) : t.push(r);
    }
    return t;
  }
  return e;
}
function Or(e, t) {
  return function(r) {
    let s;
    return le(
      () => s = I(() => (E.context = {
        ...E.context,
        [e]: r.value
      }, Tn(() => r.children))),
      void 0
    ), s;
  };
}
var Pt = Symbol("fallback");
function gt(e) {
  for (let t = 0; t < e.length; t++)
    e[t]();
}
function Tr(e, t, n = {}) {
  let r = [], s = [], o = [], i = 0, a = t.length > 1 ? [] : null;
  return Le(() => gt(o)), () => {
    let u = e() || [], c = u.length, d, f;
    return u[En], I(() => {
      let p, A, P, F, Y, U, V, j, L;
      if (c === 0)
        i !== 0 && (gt(o), o = [], r = [], s = [], i = 0, a && (a = [])), n.fallback && (r = [Pt], s[0] = ie((ee) => (o[0] = ee, n.fallback())), i = 1);
      else if (i === 0) {
        for (s = new Array(c), f = 0; f < c; f++)
          r[f] = u[f], s[f] = ie(w);
        i = c;
      } else {
        for (P = new Array(c), F = new Array(c), a && (Y = new Array(c)), U = 0, V = Math.min(i, c); U < V && r[U] === u[U]; U++)
          ;
        for (V = i - 1, j = c - 1; V >= U && j >= U && r[V] === u[j]; V--, j--)
          P[j] = s[V], F[j] = o[V], a && (Y[j] = a[V]);
        for (p = /* @__PURE__ */ new Map(), A = new Array(j + 1), f = j; f >= U; f--)
          L = u[f], d = p.get(L), A[f] = d === void 0 ? -1 : d, p.set(L, f);
        for (d = U; d <= V; d++)
          L = r[d], f = p.get(L), f !== void 0 && f !== -1 ? (P[f] = s[d], F[f] = o[d], a && (Y[f] = a[d]), f = A[f], p.set(L, f)) : o[d]();
        for (f = U; f < c; f++)
          f in P ? (s[f] = P[f], o[f] = F[f], a && (a[f] = Y[f], a[f](f))) : s[f] = ie(w);
        s = s.slice(0, i = c), r = u.slice(0);
      }
      return s;
    });
    function w(p) {
      if (o[f] = p, a) {
        const [A, P] = R(f);
        return a[f] = P, t(u[f], A);
      }
      return t(u[f]);
    }
  };
}
function xr(e, t, n = {}) {
  let r = [], s = [], o = [], i = [], a = 0, u;
  return Le(() => gt(o)), () => {
    const c = e() || [], d = c.length;
    return c[En], I(() => {
      if (d === 0)
        return a !== 0 && (gt(o), o = [], r = [], s = [], a = 0, i = []), n.fallback && (r = [Pt], s[0] = ie((w) => (o[0] = w, n.fallback())), a = 1), s;
      for (r[0] === Pt && (o[0](), o = [], r = [], s = [], a = 0), u = 0; u < d; u++)
        u < r.length && r[u] !== c[u] ? i[u](() => c[u]) : u >= r.length && (s[u] = ie(f));
      for (; u < r.length; u++)
        o[u]();
      return a = i.length = o.length = d, r = c.slice(0), s = s.slice(0, a);
    });
    function f(w) {
      o[u] = w;
      const [p, A] = R(c[u]);
      return i[u] = A, t(p, u);
    }
  };
}
function Rn(e, t) {
  return I(() => e(t || {}));
}
function nt() {
  return !0;
}
var _t = {
  get(e, t, n) {
    return t === ut ? n : e.get(t);
  },
  has(e, t) {
    return t === ut ? !0 : e.has(t);
  },
  set: nt,
  deleteProperty: nt,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: nt,
      deleteProperty: nt
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function Ct(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function Cr() {
  for (let e = 0, t = this.length; e < t; ++e) {
    const n = this[e]();
    if (n !== void 0)
      return n;
  }
}
function Pn(...e) {
  let t = !1;
  for (let i = 0; i < e.length; i++) {
    const a = e[i];
    t = t || !!a && ut in a, e[i] = typeof a == "function" ? (t = !0, q(a)) : a;
  }
  if (bn && t)
    return new Proxy(
      {
        get(i) {
          for (let a = e.length - 1; a >= 0; a--) {
            const u = Ct(e[a])[i];
            if (u !== void 0)
              return u;
          }
        },
        has(i) {
          for (let a = e.length - 1; a >= 0; a--)
            if (i in Ct(e[a]))
              return !0;
          return !1;
        },
        keys() {
          const i = [];
          for (let a = 0; a < e.length; a++)
            i.push(...Object.keys(Ct(e[a])));
          return [...new Set(i)];
        }
      },
      _t
    );
  const n = {}, r = /* @__PURE__ */ Object.create(null);
  for (let i = e.length - 1; i >= 0; i--) {
    const a = e[i];
    if (!a)
      continue;
    const u = Object.getOwnPropertyNames(a);
    for (let c = u.length - 1; c >= 0; c--) {
      const d = u[c];
      if (d === "__proto__" || d === "constructor")
        continue;
      const f = Object.getOwnPropertyDescriptor(a, d);
      if (!r[d])
        r[d] = f.get ? {
          enumerable: !0,
          configurable: !0,
          get: Cr.bind(n[d] = [f.get.bind(a)])
        } : f.value !== void 0 ? f : void 0;
      else {
        const w = n[d];
        w && (f.get ? w.push(f.get.bind(a)) : f.value !== void 0 && w.push(() => f.value));
      }
    }
  }
  const s = {}, o = Object.keys(r);
  for (let i = o.length - 1; i >= 0; i--) {
    const a = o[i], u = r[a];
    u && u.get ? Object.defineProperty(s, a, u) : s[a] = u ? u.value : void 0;
  }
  return s;
}
function kr(e, ...t) {
  if (bn && ut in e) {
    const s = new Set(t.length > 1 ? t.flat() : t[0]), o = t.map((i) => new Proxy(
      {
        get(a) {
          return i.includes(a) ? e[a] : void 0;
        },
        has(a) {
          return i.includes(a) && a in e;
        },
        keys() {
          return i.filter((a) => a in e);
        }
      },
      _t
    ));
    return o.push(
      new Proxy(
        {
          get(i) {
            return s.has(i) ? void 0 : e[i];
          },
          has(i) {
            return s.has(i) ? !1 : i in e;
          },
          keys() {
            return Object.keys(e).filter((i) => !s.has(i));
          }
        },
        _t
      )
    ), o;
  }
  const n = {}, r = t.map(() => ({}));
  for (const s of Object.getOwnPropertyNames(e)) {
    const o = Object.getOwnPropertyDescriptor(e, s), i = !o.get && !o.set && o.enumerable && o.writable && o.configurable;
    let a = !1, u = 0;
    for (const c of t)
      c.includes(s) && (a = !0, i ? r[u][s] = o.value : Object.defineProperty(r[u], s, o)), ++u;
    a || (i ? n[s] = o.value : Object.defineProperty(n, s, o));
  }
  return [...r, n];
}
function _n(e) {
  let t, n;
  const r = (s) => {
    const o = m.context;
    if (o) {
      const [a, u] = R();
      m.count || (m.count = 0), m.count++, (n || (n = e())).then((c) => {
        !m.done && Me(o), m.count--, u(() => c.default), Me();
      }), t = a;
    } else if (!t) {
      const [a] = yr(() => (n || (n = e())).then((u) => u.default));
      t = a;
    }
    let i;
    return q(
      () => (i = t()) ? I(() => {
        if (!o || m.done)
          return i(s);
        const a = m.context;
        Me(o);
        const u = i(s);
        return Me(a), u;
      }) : ""
    );
  };
  return r.preload = () => n || ((n = e()).then((s) => t = () => s.default), n), r;
}
var Nr = 0;
function Hs() {
  return m.context ? m.getNextContextId() : `cl-${Nr++}`;
}
var In = (e) => `Stale read from <${e}>.`;
function Ks(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return q(Tr(() => e.each, e.children, t || void 0));
}
function Ws(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return q(xr(() => e.each, e.children, t || void 0));
}
function Qs(e) {
  const t = e.keyed, n = q(() => e.when, void 0, {
    equals: (r, s) => t ? r === s : !r == !s
  });
  return q(
    () => {
      const r = n();
      if (r) {
        const s = e.children;
        return typeof s == "function" && s.length > 0 ? I(
          () => s(
            t ? r : () => {
              if (!I(n))
                throw In("Show");
              return e.when;
            }
          )
        ) : s;
      }
      return e.fallback;
    },
    void 0,
    void 0
  );
}
function Xs(e) {
  let t = !1;
  const n = (o, i) => (t ? o[1] === i[1] : !o[1] == !i[1]) && o[2] === i[2], r = Tn(() => e.children), s = q(
    () => {
      let o = r();
      Array.isArray(o) || (o = [o]);
      for (let i = 0; i < o.length; i++) {
        const a = o[i].when;
        if (a)
          return t = !!o[i].keyed, [i, a, o[i]];
      }
      return [-1];
    },
    void 0,
    {
      equals: n
    }
  );
  return q(
    () => {
      const [o, i, a] = s();
      if (o < 0)
        return e.fallback;
      const u = a.children;
      return typeof u == "function" && u.length > 0 ? I(
        () => u(
          t ? i : () => {
            if (I(s)[0] !== o)
              throw In("Match");
            return a.when;
          }
        )
      ) : u;
    },
    void 0,
    void 0
  );
}
function Js(e) {
  return e;
}
var Rr = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected"
], Pr = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  ...Rr
]), _r = /* @__PURE__ */ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children"
]), Ir = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), jr = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  }
});
function Mr(e, t) {
  const n = jr[e];
  return typeof n == "object" ? n[t] ? n.$ : void 0 : n;
}
var $r = /* @__PURE__ */ new Set([
  "beforeinput",
  "click",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
]), Vr = /* @__PURE__ */ new Set([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]), Lr = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
function Dr(e, t, n) {
  let r = n.length, s = t.length, o = r, i = 0, a = 0, u = t[s - 1].nextSibling, c = null;
  for (; i < s || a < o; ) {
    if (t[i] === n[a]) {
      i++, a++;
      continue;
    }
    for (; t[s - 1] === n[o - 1]; )
      s--, o--;
    if (s === i) {
      const d = o < r ? a ? n[a - 1].nextSibling : n[o - a] : u;
      for (; a < o; )
        e.insertBefore(n[a++], d);
    } else if (o === a)
      for (; i < s; )
        (!c || !c.has(t[i])) && t[i].remove(), i++;
    else if (t[i] === n[o - 1] && n[a] === t[s - 1]) {
      const d = t[--s].nextSibling;
      e.insertBefore(n[a++], t[i++].nextSibling), e.insertBefore(n[--o], d), t[s] = n[o];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let f = a;
        for (; f < o; )
          c.set(n[f], f++);
      }
      const d = c.get(t[i]);
      if (d != null)
        if (a < d && d < o) {
          let f = i, w = 1, p;
          for (; ++f < s && f < o && !((p = c.get(t[f])) == null || p !== d + w); )
            w++;
          if (w > d - a) {
            const A = t[i];
            for (; a < d; )
              e.insertBefore(n[a++], A);
          } else
            e.replaceChild(n[a++], t[i++]);
        } else
          i++;
      else
        t[i++].remove();
    }
  }
}
var $e = "_$DX_DELEGATE";
function jn(e, t, n, r = {}) {
  let s;
  return ie((o) => {
    s = o, t === document ? e() : jt(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    s(), t.textContent = "";
  };
}
function Zs(e, t, n) {
  let r;
  const s = () => {
    const i = document.createElement("template");
    return i.innerHTML = e, i.content.firstChild;
  }, o = () => (r || (r = s())).cloneNode(!0);
  return o.cloneNode = o, o;
}
function Ur(e, t = window.document) {
  const n = t[$e] || (t[$e] = /* @__PURE__ */ new Set());
  for (let r = 0, s = e.length; r < s; r++) {
    const o = e[r];
    n.has(o) || (n.add(o), t.addEventListener(o, Mn));
  }
}
function eo(e = window.document) {
  if (e[$e]) {
    for (let t of e[$e].keys())
      e.removeEventListener(t, Mn);
    delete e[$e];
  }
}
function It(e, t, n) {
  ae(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Br(e, t, n, r) {
  ae(e) || (r == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, r));
}
function qr(e, t, n) {
  ae(e) || (n ? e.setAttribute(t, "") : e.removeAttribute(t));
}
function Fr(e, t) {
  ae(e) || (t == null ? e.removeAttribute("class") : e.className = t);
}
function Yr(e, t, n, r) {
  if (r)
    Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
  else if (Array.isArray(n)) {
    const s = n[0];
    e.addEventListener(t, n[0] = (o) => s.call(e, n[1], o));
  } else
    e.addEventListener(t, n, typeof n != "function" && n);
}
function zr(e, t, n = {}) {
  const r = Object.keys(t || {}), s = Object.keys(n);
  let o, i;
  for (o = 0, i = s.length; o < i; o++) {
    const a = s[o];
    !a || a === "undefined" || t[a] || (un(e, a, !1), delete n[a]);
  }
  for (o = 0, i = r.length; o < i; o++) {
    const a = r[o], u = !!t[a];
    !a || a === "undefined" || n[a] === u || !u || (un(e, a, !0), n[a] = u);
  }
  return n;
}
function Gr(e, t, n) {
  if (!t)
    return n ? It(e, "style") : t;
  const r = e.style;
  if (typeof t == "string")
    return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let s, o;
  for (o in n)
    t[o] == null && r.removeProperty(o), delete n[o];
  for (o in t)
    s = t[o], s !== n[o] && (r.setProperty(o, s), n[o] = s);
  return n;
}
function Hr(e, t = {}, n, r) {
  const s = {};
  return r || le(
    () => s.children = Ue(e, t.children, s.children)
  ), le(() => typeof t.ref == "function" && Kr(t.ref, e)), le(() => Wr(e, t, n, !0, s, !0)), s;
}
function Kr(e, t, n) {
  return I(() => e(t, n));
}
function jt(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function")
    return Ue(e, t, r, n);
  le((s) => Ue(e, t(), s, n), r);
}
function Wr(e, t, n, r, s = {}, o = !1) {
  t || (t = {});
  for (const i in s)
    if (!(i in t)) {
      if (i === "children")
        continue;
      s[i] = cn(e, i, null, s[i], n, o, t);
    }
  for (const i in t) {
    if (i === "children")
      continue;
    const a = t[i];
    s[i] = cn(e, i, a, s[i], n, o, t);
  }
}
function Qr(e) {
  let t, n;
  return !ae() || !(t = m.registry.get(n = Jr())) ? e() : (m.completed && m.completed.add(t), m.registry.delete(n), t);
}
function ae(e) {
  return !!m.context && !m.done && (!e || e.isConnected);
}
function Xr(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function un(e, t, n) {
  const r = t.trim().split(/\s+/);
  for (let s = 0, o = r.length; s < o; s++)
    e.classList.toggle(r[s], n);
}
function cn(e, t, n, r, s, o, i) {
  let a, u, c, d, f;
  if (t === "style")
    return Gr(e, n, r);
  if (t === "classList")
    return zr(e, n, r);
  if (n === r)
    return r;
  if (t === "ref")
    o || n(e);
  else if (t.slice(0, 3) === "on:") {
    const w = t.slice(3);
    r && e.removeEventListener(w, r, typeof r != "function" && r), n && e.addEventListener(w, n, typeof n != "function" && n);
  } else if (t.slice(0, 10) === "oncapture:") {
    const w = t.slice(10);
    r && e.removeEventListener(w, r, !0), n && e.addEventListener(w, n, !0);
  } else if (t.slice(0, 2) === "on") {
    const w = t.slice(2).toLowerCase(), p = $r.has(w);
    if (!p && r) {
      const A = Array.isArray(r) ? r[0] : r;
      e.removeEventListener(w, A);
    }
    (p || n) && (Yr(e, w, n, p), p && Ur([w]));
  } else if (t.slice(0, 5) === "attr:")
    It(e, t.slice(5), n);
  else if (t.slice(0, 5) === "bool:")
    qr(e, t.slice(5), n);
  else if ((f = t.slice(0, 5) === "prop:") || (c = _r.has(t)) || !s && ((d = Mr(t, e.tagName)) || (u = Pr.has(t))) || (a = e.nodeName.includes("-") || "is" in i)) {
    if (f)
      t = t.slice(5), u = !0;
    else if (ae(e))
      return n;
    t === "class" || t === "className" ? Fr(e, n) : a && !u && !c ? e[Xr(t)] = n : e[d || t] = n;
  } else {
    const w = s && t.indexOf(":") > -1 && Lr[t.split(":")[0]];
    w ? Br(e, w, t, n) : It(e, Ir[t] || t, n);
  }
  return n;
}
function Mn(e) {
  if (m.registry && m.events && m.events.find(([u, c]) => c === e))
    return;
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, s = e.currentTarget, o = (u) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: u
  }), i = () => {
    const u = t[n];
    if (u && !t.disabled) {
      const c = t[`${n}Data`];
      if (c !== void 0 ? u.call(t, c, e) : u.call(t, e), e.cancelBubble)
        return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && o(t.host), !0;
  }, a = () => {
    for (; i() && (t = t._$host || t.parentNode || t.host); )
      ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), m.registry && !m.done && (m.done = _$HY.done = !0), e.composedPath) {
    const u = e.composedPath();
    o(u[0]);
    for (let c = 0; c < u.length - 2 && (t = u[c], !!i()); c++) {
      if (t._$host) {
        t = t._$host, a();
        break;
      }
      if (t.parentNode === s)
        break;
    }
  } else
    a();
  o(r);
}
function Ue(e, t, n, r, s) {
  const o = ae(e);
  if (o) {
    !n && (n = [...e.childNodes]);
    let u = [];
    for (let c = 0; c < n.length; c++) {
      const d = n[c];
      d.nodeType === 8 && d.data.slice(0, 2) === "!$" ? d.remove() : u.push(d);
    }
    n = u;
  }
  for (; typeof n == "function"; )
    n = n();
  if (t === n)
    return n;
  const i = typeof t, a = r !== void 0;
  if (e = a && n[0] && n[0].parentNode || e, i === "string" || i === "number") {
    if (o || i === "number" && (t = t.toString(), t === n))
      return n;
    if (a) {
      let u = n[0];
      u && u.nodeType === 3 ? u.data !== t && (u.data = t) : u = document.createTextNode(t), n = de(e, n, r, u);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean") {
    if (o)
      return n;
    n = de(e, n, r);
  } else {
    if (i === "function")
      return le(() => {
        let u = t();
        for (; typeof u == "function"; )
          u = u();
        n = Ue(e, u, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const u = [], c = n && Array.isArray(n);
      if (Mt(u, t, n, s))
        return le(() => n = Ue(e, u, n, r, !0)), () => n;
      if (o) {
        if (!u.length)
          return n;
        if (r === void 0)
          return n = [...e.childNodes];
        let d = u[0];
        if (d.parentNode !== e)
          return n;
        const f = [d];
        for (; (d = d.nextSibling) !== r; )
          f.push(d);
        return n = f;
      }
      if (u.length === 0) {
        if (n = de(e, n, r), a)
          return n;
      } else c ? n.length === 0 ? fn(e, u, r) : Dr(e, n, u) : (n && de(e), fn(e, u));
      n = u;
    } else if (t.nodeType) {
      if (o && t.parentNode)
        return n = a ? [t] : t;
      if (Array.isArray(n)) {
        if (a)
          return n = de(e, n, r, t);
        de(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function Mt(e, t, n, r) {
  let s = !1;
  for (let o = 0, i = t.length; o < i; o++) {
    let a = t[o], u = n && n[e.length], c;
    if (!(a == null || a === !0 || a === !1))
      if ((c = typeof a) == "object" && a.nodeType)
        e.push(a);
      else if (Array.isArray(a))
        s = Mt(e, a, u) || s;
      else if (c === "function")
        if (r) {
          for (; typeof a == "function"; )
            a = a();
          s = Mt(
            e,
            Array.isArray(a) ? a : [a],
            Array.isArray(u) ? u : [u]
          ) || s;
        } else
          e.push(a), s = !0;
      else {
        const d = String(a);
        u && u.nodeType === 3 && u.data === d ? e.push(u) : e.push(document.createTextNode(d));
      }
  }
  return s;
}
function fn(e, t, n = null) {
  for (let r = 0, s = t.length; r < s; r++)
    e.insertBefore(t[r], n);
}
function de(e, t, n, r) {
  if (n === void 0)
    return e.textContent = "";
  const s = r || document.createTextNode("");
  if (t.length) {
    let o = !1;
    for (let i = t.length - 1; i >= 0; i--) {
      const a = t[i];
      if (s !== a) {
        const u = a.parentNode === e;
        !o && !i ? u ? e.replaceChild(s, a) : e.insertBefore(s, n) : u && a.remove();
      } else
        o = !0;
    }
  } else
    e.insertBefore(s, n);
  return [s];
}
function Jr() {
  return m.getNextContextId();
}
var Zr = "http://www.w3.org/2000/svg";
function $n(e, t = !1) {
  return t ? document.createElementNS(Zr, e) : document.createElement(e);
}
function to(e) {
  const { useShadow: t } = e, n = document.createTextNode(""), r = () => e.mount || document.body, s = an();
  let o, i = !!m.context;
  return On(
    () => {
      i && (an().user = i = !1), o || (o = vr(s, () => q(() => e.children)));
      const a = r();
      if (a instanceof HTMLHeadElement) {
        const [u, c] = R(!1), d = () => c(!0);
        ie((f) => jt(a, () => u() ? f() : o(), null)), Le(d);
      } else {
        const u = $n(e.isSVG ? "g" : "div", e.isSVG), c = t && u.attachShadow ? u.attachShadow({
          mode: "open"
        }) : u;
        Object.defineProperty(u, "_$host", {
          get() {
            return n.parentNode;
          },
          configurable: !0
        }), jt(c, o), a.appendChild(u), e.ref && e.ref(u), Le(() => a.removeChild(u));
      }
    },
    void 0,
    {
      render: !i
    }
  ), n;
}
function no(e) {
  const [t, n] = kr(e, ["component"]), r = q(() => t.component);
  return q(() => {
    const s = r();
    switch (typeof s) {
      case "function":
        return I(() => s(n));
      case "string":
        const o = Vr.has(s), i = m.context ? Qr() : $n(s, o);
        return Hr(i, n, o), i;
    }
  });
}
var es = class {
  constructor() {
    this.keyToValue = /* @__PURE__ */ new Map(), this.valueToKey = /* @__PURE__ */ new Map();
  }
  set(e, t) {
    this.keyToValue.set(e, t), this.valueToKey.set(t, e);
  }
  getByKey(e) {
    return this.keyToValue.get(e);
  }
  getByValue(e) {
    return this.valueToKey.get(e);
  }
  clear() {
    this.keyToValue.clear(), this.valueToKey.clear();
  }
}, Vn = class {
  constructor(e) {
    this.generateIdentifier = e, this.kv = new es();
  }
  register(e, t) {
    this.kv.getByValue(e) || (t || (t = this.generateIdentifier(e)), this.kv.set(t, e));
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(e) {
    return this.kv.getByValue(e);
  }
  getValue(e) {
    return this.kv.getByKey(e);
  }
}, ts = class extends Vn {
  constructor() {
    super((e) => e.name), this.classToAllowedProps = /* @__PURE__ */ new Map();
  }
  register(e, t) {
    typeof t == "object" ? (t.allowProps && this.classToAllowedProps.set(e, t.allowProps), super.register(e, t.identifier)) : super.register(e, t);
  }
  getAllowedProps(e) {
    return this.classToAllowedProps.get(e);
  }
};
function ns(e) {
  if ("values" in Object)
    return Object.values(e);
  const t = [];
  for (const n in e)
    e.hasOwnProperty(n) && t.push(e[n]);
  return t;
}
function rs(e, t) {
  const n = ns(e);
  if ("find" in n)
    return n.find(t);
  const r = n;
  for (let s = 0; s < r.length; s++) {
    const o = r[s];
    if (t(o))
      return o;
  }
}
function Ne(e, t) {
  Object.entries(e).forEach(([n, r]) => t(r, n));
}
function lt(e, t) {
  return e.indexOf(t) !== -1;
}
function dn(e, t) {
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    if (t(r))
      return r;
  }
}
var ss = class {
  constructor() {
    this.transfomers = {};
  }
  register(e) {
    this.transfomers[e.name] = e;
  }
  findApplicable(e) {
    return rs(this.transfomers, (t) => t.isApplicable(e));
  }
  findByName(e) {
    return this.transfomers[e];
  }
}, os = (e) => Object.prototype.toString.call(e).slice(8, -1), Ln = (e) => typeof e > "u", is = (e) => e === null, Be = (e) => typeof e != "object" || e === null || e === Object.prototype ? !1 : Object.getPrototypeOf(e) === null ? !0 : Object.getPrototypeOf(e) === Object.prototype, $t = (e) => Be(e) && Object.keys(e).length === 0, Z = (e) => Array.isArray(e), ls = (e) => typeof e == "string", as = (e) => typeof e == "number" && !isNaN(e), us = (e) => typeof e == "boolean", cs = (e) => e instanceof RegExp, qe = (e) => e instanceof Map, Fe = (e) => e instanceof Set, Dn = (e) => os(e) === "Symbol", fs = (e) => e instanceof Date && !isNaN(e.valueOf()), ds = (e) => e instanceof Error, hn = (e) => typeof e == "number" && isNaN(e), hs = (e) => us(e) || is(e) || Ln(e) || as(e) || ls(e) || Dn(e), gs = (e) => typeof e == "bigint", ys = (e) => e === 1 / 0 || e === -1 / 0, ms = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), vs = (e) => e instanceof URL, Un = (e) => e.replace(/\./g, "\\."), kt = (e) => e.map(String).map(Un).join("."), Ve = (e) => {
  const t = [];
  let n = "";
  for (let s = 0; s < e.length; s++) {
    let o = e.charAt(s);
    if (o === "\\" && e.charAt(s + 1) === ".") {
      n += ".", s++;
      continue;
    }
    if (o === ".") {
      t.push(n), n = "";
      continue;
    }
    n += o;
  }
  const r = n;
  return t.push(r), t;
};
function G(e, t, n, r) {
  return {
    isApplicable: e,
    annotation: t,
    transform: n,
    untransform: r
  };
}
var Bn = [
  G(Ln, "undefined", () => null, () => {
  }),
  G(gs, "bigint", (e) => e.toString(), (e) => typeof BigInt < "u" ? BigInt(e) : e),
  G(fs, "Date", (e) => e.toISOString(), (e) => new Date(e)),
  G(ds, "Error", (e, t) => {
    const n = {
      name: e.name,
      message: e.message
    };
    return t.allowedErrorProps.forEach((r) => {
      n[r] = e[r];
    }), n;
  }, (e, t) => {
    const n = new Error(e.message);
    return n.name = e.name, n.stack = e.stack, t.allowedErrorProps.forEach((r) => {
      n[r] = e[r];
    }), n;
  }),
  G(cs, "regexp", (e) => "" + e, (e) => {
    const t = e.slice(1, e.lastIndexOf("/")), n = e.slice(e.lastIndexOf("/") + 1);
    return new RegExp(t, n);
  }),
  G(
    Fe,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (e) => [...e.values()],
    (e) => new Set(e)
  ),
  G(qe, "map", (e) => [...e.entries()], (e) => new Map(e)),
  G((e) => hn(e) || ys(e), "number", (e) => hn(e) ? "NaN" : e > 0 ? "Infinity" : "-Infinity", Number),
  G((e) => e === 0 && 1 / e === -1 / 0, "number", () => "-0", Number),
  G(vs, "URL", (e) => e.toString(), (e) => new URL(e))
];
function vt(e, t, n, r) {
  return {
    isApplicable: e,
    annotation: t,
    transform: n,
    untransform: r
  };
}
var qn = vt((e, t) => Dn(e) ? !!t.symbolRegistry.getIdentifier(e) : !1, (e, t) => ["symbol", t.symbolRegistry.getIdentifier(e)], (e) => e.description, (e, t, n) => {
  const r = n.symbolRegistry.getValue(t[1]);
  if (!r)
    throw new Error("Trying to deserialize unknown symbol");
  return r;
}), ws = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((e, t) => (e[t.name] = t, e), {}), Fn = vt(ms, (e) => ["typed-array", e.constructor.name], (e) => [...e], (e, t) => {
  const n = ws[t[1]];
  if (!n)
    throw new Error("Trying to deserialize unknown typed array");
  return new n(e);
});
function Yn(e, t) {
  return e != null && e.constructor ? !!t.classRegistry.getIdentifier(e.constructor) : !1;
}
var zn = vt(Yn, (e, t) => ["class", t.classRegistry.getIdentifier(e.constructor)], (e, t) => {
  const n = t.classRegistry.getAllowedProps(e.constructor);
  if (!n)
    return { ...e };
  const r = {};
  return n.forEach((s) => {
    r[s] = e[s];
  }), r;
}, (e, t, n) => {
  const r = n.classRegistry.getValue(t[1]);
  if (!r)
    throw new Error("Trying to deserialize unknown class - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564");
  return Object.assign(Object.create(r.prototype), e);
}), Gn = vt((e, t) => !!t.customTransformerRegistry.findApplicable(e), (e, t) => ["custom", t.customTransformerRegistry.findApplicable(e).name], (e, t) => t.customTransformerRegistry.findApplicable(e).serialize(e), (e, t, n) => {
  const r = n.customTransformerRegistry.findByName(t[1]);
  if (!r)
    throw new Error("Trying to deserialize unknown custom value");
  return r.deserialize(e);
}), ps = [zn, qn, Gn, Fn], gn = (e, t) => {
  const n = dn(ps, (s) => s.isApplicable(e, t));
  if (n)
    return {
      value: n.transform(e, t),
      type: n.annotation(e, t)
    };
  const r = dn(Bn, (s) => s.isApplicable(e, t));
  if (r)
    return {
      value: r.transform(e, t),
      type: r.annotation
    };
}, Hn = {};
Bn.forEach((e) => {
  Hn[e.annotation] = e;
});
var bs = (e, t, n) => {
  if (Z(t))
    switch (t[0]) {
      case "symbol":
        return qn.untransform(e, t, n);
      case "class":
        return zn.untransform(e, t, n);
      case "custom":
        return Gn.untransform(e, t, n);
      case "typed-array":
        return Fn.untransform(e, t, n);
      default:
        throw new Error("Unknown transformation: " + t);
    }
  else {
    const r = Hn[t];
    if (!r)
      throw new Error("Unknown transformation: " + t);
    return r.untransform(e, n);
  }
}, he = (e, t) => {
  const n = e.keys();
  for (; t > 0; )
    n.next(), t--;
  return n.next().value;
};
function Kn(e) {
  if (lt(e, "__proto__"))
    throw new Error("__proto__ is not allowed as a property");
  if (lt(e, "prototype"))
    throw new Error("prototype is not allowed as a property");
  if (lt(e, "constructor"))
    throw new Error("constructor is not allowed as a property");
}
var Es = (e, t) => {
  Kn(t);
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    if (Fe(e))
      e = he(e, +r);
    else if (qe(e)) {
      const s = +r, o = +t[++n] == 0 ? "key" : "value", i = he(e, s);
      switch (o) {
        case "key":
          e = i;
          break;
        case "value":
          e = e.get(i);
          break;
      }
    } else
      e = e[r];
  }
  return e;
}, Vt = (e, t, n) => {
  if (Kn(t), t.length === 0)
    return n(e);
  let r = e;
  for (let o = 0; o < t.length - 1; o++) {
    const i = t[o];
    if (Z(r)) {
      const a = +i;
      r = r[a];
    } else if (Be(r))
      r = r[i];
    else if (Fe(r)) {
      const a = +i;
      r = he(r, a);
    } else if (qe(r)) {
      if (o === t.length - 2)
        break;
      const u = +i, c = +t[++o] == 0 ? "key" : "value", d = he(r, u);
      switch (c) {
        case "key":
          r = d;
          break;
        case "value":
          r = r.get(d);
          break;
      }
    }
  }
  const s = t[t.length - 1];
  if (Z(r) ? r[+s] = n(r[+s]) : Be(r) && (r[s] = n(r[s])), Fe(r)) {
    const o = he(r, +s), i = n(o);
    o !== i && (r.delete(o), r.add(i));
  }
  if (qe(r)) {
    const o = +t[t.length - 2], i = he(r, o);
    switch (+s == 0 ? "key" : "value") {
      case "key": {
        const u = n(i);
        r.set(u, r.get(i)), u !== i && r.delete(i);
        break;
      }
      case "value": {
        r.set(i, n(r.get(i)));
        break;
      }
    }
  }
  return e;
};
function Lt(e, t, n = []) {
  if (!e)
    return;
  if (!Z(e)) {
    Ne(e, (o, i) => Lt(o, t, [...n, ...Ve(i)]));
    return;
  }
  const [r, s] = e;
  s && Ne(s, (o, i) => {
    Lt(o, t, [...n, ...Ve(i)]);
  }), t(r, n);
}
function Ss(e, t, n) {
  return Lt(t, (r, s) => {
    e = Vt(e, s, (o) => bs(o, r, n));
  }), e;
}
function As(e, t) {
  function n(r, s) {
    const o = Es(e, Ve(s));
    r.map(Ve).forEach((i) => {
      e = Vt(e, i, () => o);
    });
  }
  if (Z(t)) {
    const [r, s] = t;
    r.forEach((o) => {
      e = Vt(e, Ve(o), () => e);
    }), s && Ne(s, n);
  } else
    Ne(t, n);
  return e;
}
var Os = (e, t) => Be(e) || Z(e) || qe(e) || Fe(e) || Yn(e, t);
function Ts(e, t, n) {
  const r = n.get(e);
  r ? r.push(t) : n.set(e, [t]);
}
function xs(e, t) {
  const n = {};
  let r;
  return e.forEach((s) => {
    if (s.length <= 1)
      return;
    t || (s = s.map((a) => a.map(String)).sort((a, u) => a.length - u.length));
    const [o, ...i] = s;
    o.length === 0 ? r = i.map(kt) : n[kt(o)] = i.map(kt);
  }), r ? $t(n) ? [r] : [r, n] : $t(n) ? void 0 : n;
}
var Wn = (e, t, n, r, s = [], o = [], i = /* @__PURE__ */ new Map()) => {
  const a = hs(e);
  if (!a) {
    Ts(e, s, t);
    const p = i.get(e);
    if (p)
      return r ? {
        transformedValue: null
      } : p;
  }
  if (!Os(e, n)) {
    const p = gn(e, n), A = p ? {
      transformedValue: p.value,
      annotations: [p.type]
    } : {
      transformedValue: e
    };
    return a || i.set(e, A), A;
  }
  if (lt(o, e))
    return {
      transformedValue: null
    };
  const u = gn(e, n), c = (u == null ? void 0 : u.value) ?? e, d = Z(c) ? [] : {}, f = {};
  Ne(c, (p, A) => {
    if (A === "__proto__" || A === "constructor" || A === "prototype")
      throw new Error(`Detected property ${A}. This is a prototype pollution risk, please remove it from your object.`);
    const P = Wn(p, t, n, r, [...s, A], [...o, e], i);
    d[A] = P.transformedValue, Z(P.annotations) ? f[A] = P.annotations : Be(P.annotations) && Ne(P.annotations, (F, Y) => {
      f[Un(A) + "." + Y] = F;
    });
  });
  const w = $t(f) ? {
    transformedValue: d,
    annotations: u ? [u.type] : void 0
  } : {
    transformedValue: d,
    annotations: u ? [u.type, f] : f
  };
  return a || i.set(e, w), w;
};
function Qn(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function yn(e) {
  return Qn(e) === "Array";
}
function Cs(e) {
  if (Qn(e) !== "Object")
    return !1;
  const t = Object.getPrototypeOf(e);
  return !!t && t.constructor === Object && t === Object.prototype;
}
function ks(e, t, n, r, s) {
  const o = {}.propertyIsEnumerable.call(r, t) ? "enumerable" : "nonenumerable";
  o === "enumerable" && (e[t] = n), s && o === "nonenumerable" && Object.defineProperty(e, t, {
    value: n,
    enumerable: !1,
    writable: !0,
    configurable: !0
  });
}
function Dt(e, t = {}) {
  if (yn(e))
    return e.map((s) => Dt(s, t));
  if (!Cs(e))
    return e;
  const n = Object.getOwnPropertyNames(e), r = Object.getOwnPropertySymbols(e);
  return [...n, ...r].reduce((s, o) => {
    if (yn(t.props) && !t.props.includes(o))
      return s;
    const i = e[o], a = Dt(i, t);
    return ks(s, o, a, e, t.nonenumerable), s;
  }, {});
}
var x = class {
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe: e = !1 } = {}) {
    this.classRegistry = new ts(), this.symbolRegistry = new Vn((t) => t.description ?? ""), this.customTransformerRegistry = new ss(), this.allowedErrorProps = [], this.dedupe = e;
  }
  serialize(e) {
    const t = /* @__PURE__ */ new Map(), n = Wn(e, t, this, this.dedupe), r = {
      json: n.transformedValue
    };
    n.annotations && (r.meta = {
      ...r.meta,
      values: n.annotations
    });
    const s = xs(t, this.dedupe);
    return s && (r.meta = {
      ...r.meta,
      referentialEqualities: s
    }), r;
  }
  deserialize(e) {
    const { json: t, meta: n } = e;
    let r = Dt(t);
    return n != null && n.values && (r = Ss(r, n.values, this)), n != null && n.referentialEqualities && (r = As(r, n.referentialEqualities)), r;
  }
  stringify(e) {
    return JSON.stringify(this.serialize(e));
  }
  parse(e) {
    return this.deserialize(JSON.parse(e));
  }
  registerClass(e, t) {
    this.classRegistry.register(e, t);
  }
  registerSymbol(e, t) {
    this.symbolRegistry.register(e, t);
  }
  registerCustom(e, t) {
    this.customTransformerRegistry.register({
      name: t,
      ...e
    });
  }
  allowErrorProps(...e) {
    this.allowedErrorProps.push(...e);
  }
};
x.defaultInstance = new x();
x.serialize = x.defaultInstance.serialize.bind(x.defaultInstance);
x.deserialize = x.defaultInstance.deserialize.bind(x.defaultInstance);
x.stringify = x.defaultInstance.stringify.bind(x.defaultInstance);
x.parse = x.defaultInstance.parse.bind(x.defaultInstance);
x.registerClass = x.defaultInstance.registerClass.bind(x.defaultInstance);
x.registerSymbol = x.defaultInstance.registerSymbol.bind(x.defaultInstance);
x.registerCustom = x.defaultInstance.registerCustom.bind(x.defaultInstance);
x.allowErrorProps = x.defaultInstance.allowErrorProps.bind(x.defaultInstance);
var Ns = x.serialize, ro = x.stringify;
function so(e) {
  return e.state.fetchStatus === "fetching" ? "fetching" : e.getObserversCount() ? e.state.fetchStatus === "paused" ? "paused" : e.isStale() ? "stale" : "fresh" : "inactive";
}
function oo(e, t) {
  return `${e}${t.charAt(0).toUpperCase() + t.slice(1)}`;
}
function io({
  queryState: e,
  observerCount: t,
  isStale: n
}) {
  return e.fetchStatus === "fetching" ? "blue" : t ? e.fetchStatus === "paused" ? "purple" : n ? "yellow" : "green" : "gray";
}
function lo({
  status: e,
  isPaused: t
}) {
  return t ? "purple" : e === "error" ? "red" : e === "pending" ? "yellow" : e === "success" ? "green" : "gray";
}
function ao(e) {
  return e === "fresh" ? "green" : e === "stale" ? "yellow" : e === "paused" ? "purple" : e === "inactive" ? "gray" : "blue";
}
var uo = (e, t = !1) => {
  const {
    json: n
  } = Ns(e);
  return JSON.stringify(n, null, t ? 2 : void 0);
}, rt = (e) => e.state.fetchStatus !== "idle" ? 0 : e.getObserversCount() ? e.isStale() ? 2 : 1 : 3, Rs = (e, t) => e.queryHash.localeCompare(t.queryHash), Xn = (e, t) => e.state.dataUpdatedAt < t.state.dataUpdatedAt ? 1 : -1, Ps = (e, t) => rt(e) === rt(t) ? Xn(e, t) : rt(e) > rt(t) ? 1 : -1, co = {
  status: Ps,
  "query hash": Rs,
  "last updated": Xn
}, st = (e) => e.state.isPaused ? 0 : e.state.status === "error" ? 2 : e.state.status === "pending" ? 1 : 3, Jn = (e, t) => e.state.submittedAt < t.state.submittedAt ? 1 : -1, _s = (e, t) => st(e) === st(t) ? Jn(e, t) : st(e) > st(t) ? 1 : -1, fo = {
  status: _s,
  "last updated": Jn
}, ho = (e) => e * parseFloat(getComputedStyle(document.documentElement).fontSize), go = () => {
  const [e, t] = R("dark");
  return mr(() => {
    const n = window.matchMedia("(prefers-color-scheme: dark)");
    t(n.matches ? "dark" : "light");
    const r = (s) => {
      t(s.matches ? "dark" : "light");
    };
    n.addEventListener("change", r), Le(() => n.removeEventListener("change", r));
  }), e;
}, ot = (e, t, n) => {
  if (t.length === 0)
    return n;
  if (e instanceof Map) {
    const r = new Map(e);
    if (t.length === 1)
      return r.set(t[0], n), r;
    const [s, ...o] = t;
    return r.set(s, ot(r.get(s), o, n)), r;
  }
  if (e instanceof Set) {
    const r = ot(Array.from(e), t, n);
    return new Set(r);
  }
  if (Array.isArray(e)) {
    const r = [...e];
    if (t.length === 1)
      return r[t[0]] = n, r;
    const [s, ...o] = t;
    return r[s] = ot(r[s], o, n), r;
  }
  if (e instanceof Object) {
    const r = {
      ...e
    };
    if (t.length === 1)
      return r[t[0]] = n, r;
    const [s, ...o] = t;
    return r[s] = ot(r[s], o, n), r;
  }
  return e;
}, it = (e, t) => {
  if (e instanceof Map) {
    const n = new Map(e);
    if (t.length === 1)
      return n.delete(t[0]), n;
    const [r, ...s] = t;
    return n.set(r, it(n.get(r), s)), n;
  }
  if (e instanceof Set) {
    const n = it(Array.from(e), t);
    return new Set(n);
  }
  if (Array.isArray(e)) {
    const n = [...e];
    if (t.length === 1)
      return n.filter((o, i) => i.toString() !== t[0]);
    const [r, ...s] = t;
    return n[r] = it(n[r], s), n;
  }
  if (e instanceof Object) {
    const n = {
      ...e
    };
    if (t.length === 1)
      return delete n[t[0]], n;
    const [r, ...s] = t;
    return n[r] = it(n[r], s), n;
  }
  return e;
}, Zn = (e, t) => {
  if (!e || document.querySelector("#_goober") || (t == null ? void 0 : t.querySelector("#_goober")))
    return;
  const r = document.createElement("style"), s = document.createTextNode("");
  r.appendChild(s), r.id = "_goober", r.setAttribute("nonce", e), t ? t.appendChild(r) : document.head.appendChild(r);
}, ge, Ye, ze, Ge, se, He, ye, me, ve, we, pe, be, Ke, mn, Is = (mn = class {
  constructor(e) {
    O(this, ge);
    O(this, Ye);
    O(this, ze);
    O(this, Ge);
    O(this, se, !1);
    O(this, He);
    O(this, ye);
    O(this, me);
    O(this, ve);
    O(this, we);
    O(this, pe);
    O(this, be);
    O(this, Ke);
    const {
      client: t,
      queryFlavor: n,
      version: r,
      onlineManager: s,
      buttonPosition: o,
      position: i,
      initialIsOpen: a,
      errorTypes: u,
      styleNonce: c,
      shadowDOMTarget: d
    } = e;
    S(this, ge, R(t)), S(this, ze, n), S(this, Ge, r), S(this, Ye, s), S(this, He, c), S(this, ye, d), S(this, me, R(o)), S(this, ve, R(i)), S(this, we, R(a)), S(this, pe, R(u));
  }
  setButtonPosition(e) {
    y(this, me)[1](e);
  }
  setPosition(e) {
    y(this, ve)[1](e);
  }
  setInitialIsOpen(e) {
    y(this, we)[1](e);
  }
  setErrorTypes(e) {
    y(this, pe)[1](e);
  }
  setClient(e) {
    y(this, ge)[1](e);
  }
  mount(e) {
    if (y(this, se))
      throw new Error("Devtools is already mounted");
    const t = jn(() => {
      const n = this, [r] = y(this, me), [s] = y(this, ve), [o] = y(this, we), [i] = y(this, pe), [a] = y(this, ge);
      let u;
      return y(this, be) ? u = y(this, be) : (u = _n(() => import("./HO4MOOFI-BB_gPHyo.js")), S(this, be, u)), Zn(y(this, He), y(this, ye)), Rn(u, Pn({
        get queryFlavor() {
          return y(n, ze);
        },
        get version() {
          return y(n, Ge);
        },
        get onlineManager() {
          return y(n, Ye);
        },
        get shadowDOMTarget() {
          return y(n, ye);
        }
      }, {
        get client() {
          return a();
        },
        get buttonPosition() {
          return r();
        },
        get position() {
          return s();
        },
        get initialIsOpen() {
          return o();
        },
        get errorTypes() {
          return i();
        }
      }));
    }, e);
    S(this, se, !0), S(this, Ke, t);
  }
  unmount() {
    var e;
    if (!y(this, se))
      throw new Error("Devtools is not mounted");
    (e = y(this, Ke)) == null || e.call(this), S(this, se, !1);
  }
}, ge = new WeakMap(), Ye = new WeakMap(), ze = new WeakMap(), Ge = new WeakMap(), se = new WeakMap(), He = new WeakMap(), ye = new WeakMap(), me = new WeakMap(), ve = new WeakMap(), we = new WeakMap(), pe = new WeakMap(), be = new WeakMap(), Ke = new WeakMap(), mn), Ee, We, Qe, Xe, oe, Je, Se, Ae, Oe, Te, xe, Ce, ke, Ze, vn, js = (vn = class {
  constructor(e) {
    O(this, Ee);
    O(this, We);
    O(this, Qe);
    O(this, Xe);
    O(this, oe, !1);
    O(this, Je);
    O(this, Se);
    O(this, Ae);
    O(this, Oe);
    O(this, Te);
    O(this, xe);
    O(this, Ce);
    O(this, ke);
    O(this, Ze);
    const {
      client: t,
      queryFlavor: n,
      version: r,
      onlineManager: s,
      buttonPosition: o,
      position: i,
      initialIsOpen: a,
      errorTypes: u,
      styleNonce: c,
      shadowDOMTarget: d,
      onClose: f
    } = e;
    S(this, Ee, R(t)), S(this, Qe, n), S(this, Xe, r), S(this, We, s), S(this, Je, c), S(this, Se, d), S(this, Ae, R(o)), S(this, Oe, R(i)), S(this, Te, R(a)), S(this, xe, R(u)), S(this, Ce, R(f));
  }
  setButtonPosition(e) {
    y(this, Ae)[1](e);
  }
  setPosition(e) {
    y(this, Oe)[1](e);
  }
  setInitialIsOpen(e) {
    y(this, Te)[1](e);
  }
  setErrorTypes(e) {
    y(this, xe)[1](e);
  }
  setClient(e) {
    y(this, Ee)[1](e);
  }
  setOnClose(e) {
    y(this, Ce)[1](() => e);
  }
  mount(e) {
    if (y(this, oe))
      throw new Error("Devtools is already mounted");
    const t = jn(() => {
      const n = this, [r] = y(this, Ae), [s] = y(this, Oe), [o] = y(this, Te), [i] = y(this, xe), [a] = y(this, Ee), [u] = y(this, Ce);
      let c;
      return y(this, ke) ? c = y(this, ke) : (c = _n(() => import("./HUY7CZI3-BTuUNfR_.js")), S(this, ke, c)), Zn(y(this, Je), y(this, Se)), Rn(c, Pn({
        get queryFlavor() {
          return y(n, Qe);
        },
        get version() {
          return y(n, Xe);
        },
        get onlineManager() {
          return y(n, We);
        },
        get shadowDOMTarget() {
          return y(n, Se);
        }
      }, {
        get client() {
          return a();
        },
        get buttonPosition() {
          return r();
        },
        get position() {
          return s();
        },
        get initialIsOpen() {
          return o();
        },
        get errorTypes() {
          return i();
        },
        get onClose() {
          return u();
        }
      }));
    }, e);
    S(this, oe, !0), S(this, Ze, t);
  }
  unmount() {
    var e;
    if (!y(this, oe))
      throw new Error("Devtools is not mounted");
    (e = y(this, Ze)) == null || e.call(this), S(this, oe, !1);
  }
}, Ee = new WeakMap(), We = new WeakMap(), Qe = new WeakMap(), Xe = new WeakMap(), oe = new WeakMap(), Je = new WeakMap(), Se = new WeakMap(), Ae = new WeakMap(), Oe = new WeakMap(), Te = new WeakMap(), xe = new WeakMap(), Ce = new WeakMap(), ke = new WeakMap(), Ze = new WeakMap(), vn);
function Ms(e) {
  const t = wn(e.client), n = B.useRef(null), {
    buttonPosition: r,
    position: s,
    initialIsOpen: o,
    errorTypes: i,
    styleNonce: a,
    shadowDOMTarget: u
  } = e, [c] = B.useState(
    new Is({
      client: t,
      queryFlavor: "React Query",
      version: "5",
      onlineManager: pn,
      buttonPosition: r,
      position: s,
      initialIsOpen: o,
      errorTypes: i,
      styleNonce: a,
      shadowDOMTarget: u
    })
  );
  return B.useEffect(() => {
    c.setClient(t);
  }, [t, c]), B.useEffect(() => {
    r && c.setButtonPosition(r);
  }, [r, c]), B.useEffect(() => {
    s && c.setPosition(s);
  }, [s, c]), B.useEffect(() => {
    c.setInitialIsOpen(o || !1);
  }, [o, c]), B.useEffect(() => {
    c.setErrorTypes(i || []);
  }, [i, c]), B.useEffect(() => (n.current && c.mount(n.current), () => {
    c.unmount();
  }), [c]), /* @__PURE__ */ at.jsx("div", { className: "tsqd-parent-container", ref: n });
}
function $s(e) {
  const t = wn(e.client), n = B.useRef(null), { errorTypes: r, styleNonce: s, shadowDOMTarget: o } = e, [i] = B.useState(
    new js({
      client: t,
      queryFlavor: "React Query",
      version: "5",
      onlineManager: pn,
      buttonPosition: "bottom-left",
      position: "bottom",
      initialIsOpen: !0,
      errorTypes: r,
      styleNonce: s,
      shadowDOMTarget: o,
      onClose: e.onClose
    })
  );
  return B.useEffect(() => {
    i.setClient(t);
  }, [t, i]), B.useEffect(() => {
    i.setOnClose(e.onClose ?? (() => {
    }));
  }, [e.onClose, i]), B.useEffect(() => {
    i.setErrorTypes(r || []);
  }, [r, i]), B.useEffect(() => (n.current && i.mount(n.current), () => {
    i.unmount();
  }), [i]), /* @__PURE__ */ at.jsx(
    "div",
    {
      style: { height: "500px", ...e.style },
      className: "tsqd-parent-container",
      ref: n
    }
  );
}
var Vs = process.env.NODE_ENV !== "development" ? function() {
  return null;
} : Ms;
process.env.NODE_ENV;
const yo = ({
  children: e,
  config: t
}) => {
  const [n] = or(
    () => new ir({
      ...t
    })
  );
  return /* @__PURE__ */ at.jsxs(lr, { client: n, children: [
    e,
    /* @__PURE__ */ at.jsx(Vs, { initialIsOpen: !1 })
  ] });
};
export {
  En as $,
  uo as A,
  Bs as B,
  eo as C,
  no as D,
  I as E,
  Ks as F,
  hr as G,
  Ns as H,
  Ws as I,
  ot as J,
  ho as K,
  oo as L,
  so as M,
  ie as N,
  Yr as O,
  to as P,
  ro as Q,
  Js as R,
  Qs as S,
  Xs as T,
  it as U,
  Ys as V,
  yo as W,
  Rn as a,
  R as b,
  q as c,
  Ur as d,
  On as e,
  Pn as f,
  go as g,
  kr as h,
  zs as i,
  le as j,
  It as k,
  Hs as l,
  fo as m,
  Le as n,
  qs as o,
  mr as p,
  Kr as q,
  jt as r,
  co as s,
  Zs as t,
  Gs as u,
  Fr as v,
  io as w,
  lo as x,
  Hr as y,
  ao as z
};

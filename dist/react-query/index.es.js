import { QueryClient as Ce, QueryClientProvider as je } from "@tanstack/react-query";
export * from "@tanstack/react-query";
import he, { useState as ke } from "react";
import { ReactQueryDevtools as Oe } from "@tanstack/react-query-devtools";
var k = { exports: {} }, w = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ce;
function Se() {
  if (ce) return w;
  ce = 1;
  var i = Symbol.for("react.transitional.element"), T = Symbol.for("react.fragment");
  function b(j, s, c) {
    var E = null;
    if (c !== void 0 && (E = "" + c), s.key !== void 0 && (E = "" + s.key), "key" in s) {
      c = {};
      for (var x in s)
        x !== "key" && (c[x] = s[x]);
    } else c = s;
    return s = c.ref, {
      $$typeof: i,
      type: j,
      key: E,
      ref: s !== void 0 ? s : null,
      props: c
    };
  }
  return w.Fragment = T, w.jsx = b, w.jsxs = b, w;
}
var C = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fe;
function Ae() {
  return fe || (fe = 1, process.env.NODE_ENV !== "production" && function() {
    function i(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === Re ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case P:
          return "Fragment";
        case xe:
          return "Portal";
        case Q:
          return "Profiler";
        case B:
          return "StrictMode";
        case M:
          return "Suspense";
        case $:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case I:
            return (e.displayName || "Context") + ".Provider";
          case F:
            return (e._context.displayName || "Context") + ".Consumer";
          case Y:
            var r = e.render;
            return e = e.displayName, e || (e = r.displayName || r.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case W:
            return r = e.displayName || null, r !== null ? r : i(e.type) || "Memo";
          case U:
            r = e._payload, e = e._init;
            try {
              return i(e(r));
            } catch {
            }
        }
      return null;
    }
    function T(e) {
      return "" + e;
    }
    function b(e) {
      try {
        T(e);
        var r = !1;
      } catch {
        r = !0;
      }
      if (r) {
        r = console;
        var o = r.error, n = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return o.call(
          r,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          n
        ), T(e);
      }
    }
    function j() {
    }
    function s() {
      if (R === 0) {
        K = console.log, D = console.info, ee = console.warn, re = console.error, oe = console.group, te = console.groupCollapsed, ne = console.groupEnd;
        var e = {
          configurable: !0,
          enumerable: !0,
          value: j,
          writable: !0
        };
        Object.defineProperties(console, {
          info: e,
          log: e,
          warn: e,
          error: e,
          group: e,
          groupCollapsed: e,
          groupEnd: e
        });
      }
      R++;
    }
    function c() {
      if (R--, R === 0) {
        var e = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: g({}, e, { value: K }),
          info: g({}, e, { value: D }),
          warn: g({}, e, { value: ee }),
          error: g({}, e, { value: re }),
          group: g({}, e, { value: oe }),
          groupCollapsed: g({}, e, { value: te }),
          groupEnd: g({}, e, { value: ne })
        });
      }
      0 > R && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function E(e) {
      if (J === void 0)
        try {
          throw Error();
        } catch (o) {
          var r = o.stack.trim().match(/\n( *(at )?)/);
          J = r && r[1] || "", ae = -1 < o.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < o.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + J + e + ae;
    }
    function x(e, r) {
      if (!e || z) return "";
      var o = V.get(e);
      if (o !== void 0) return o;
      z = !0, o = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var n = null;
      n = m.H, m.H = null, s();
      try {
        var u = {
          DetermineComponentFrameRoot: function() {
            try {
              if (r) {
                var d = function() {
                  throw Error();
                };
                if (Object.defineProperty(d.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(d, []);
                  } catch (v) {
                    var h = v;
                  }
                  Reflect.construct(e, [], d);
                } else {
                  try {
                    d.call();
                  } catch (v) {
                    h = v;
                  }
                  e.call(d.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (v) {
                  h = v;
                }
                (d = e()) && typeof d.catch == "function" && d.catch(function() {
                });
              }
            } catch (v) {
              if (v && h && typeof v.stack == "string")
                return [v.stack, h.stack];
            }
            return [null, null];
          }
        };
        u.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var a = Object.getOwnPropertyDescriptor(
          u.DetermineComponentFrameRoot,
          "name"
        );
        a && a.configurable && Object.defineProperty(
          u.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var t = u.DetermineComponentFrameRoot(), f = t[0], y = t[1];
        if (f && y) {
          var l = f.split(`
`), _ = y.split(`
`);
          for (t = a = 0; a < l.length && !l[a].includes(
            "DetermineComponentFrameRoot"
          ); )
            a++;
          for (; t < _.length && !_[t].includes(
            "DetermineComponentFrameRoot"
          ); )
            t++;
          if (a === l.length || t === _.length)
            for (a = l.length - 1, t = _.length - 1; 1 <= a && 0 <= t && l[a] !== _[t]; )
              t--;
          for (; 1 <= a && 0 <= t; a--, t--)
            if (l[a] !== _[t]) {
              if (a !== 1 || t !== 1)
                do
                  if (a--, t--, 0 > t || l[a] !== _[t]) {
                    var p = `
` + l[a].replace(
                      " at new ",
                      " at "
                    );
                    return e.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", e.displayName)), typeof e == "function" && V.set(e, p), p;
                  }
                while (1 <= a && 0 <= t);
              break;
            }
        }
      } finally {
        z = !1, m.H = n, c(), Error.prepareStackTrace = o;
      }
      return l = (l = e ? e.displayName || e.name : "") ? E(l) : "", typeof e == "function" && V.set(e, l), l;
    }
    function O(e) {
      if (e == null) return "";
      if (typeof e == "function") {
        var r = e.prototype;
        return x(
          e,
          !(!r || !r.isReactComponent)
        );
      }
      if (typeof e == "string") return E(e);
      switch (e) {
        case M:
          return E("Suspense");
        case $:
          return E("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case Y:
            return e = x(e.render, !1), e;
          case W:
            return O(e.type);
          case U:
            r = e._payload, e = e._init;
            try {
              return O(e(r));
            } catch {
            }
        }
      return "";
    }
    function S() {
      var e = m.A;
      return e === null ? null : e.getOwner();
    }
    function de(e) {
      if (Z.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function be(e, r) {
      function o() {
        ue || (ue = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          r
        ));
      }
      o.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: o,
        configurable: !0
      });
    }
    function me() {
      var e = i(this.type);
      return le[e] || (le[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function ge(e, r, o, n, u, a) {
      return o = a.ref, e = {
        $$typeof: N,
        type: e,
        key: r,
        props: a,
        _owner: u
      }, (o !== void 0 ? o : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: me
      }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(e, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function G(e, r, o, n, u, a) {
      if (typeof e == "string" || typeof e == "function" || e === P || e === Q || e === B || e === M || e === $ || e === ye || typeof e == "object" && e !== null && (e.$$typeof === U || e.$$typeof === W || e.$$typeof === I || e.$$typeof === F || e.$$typeof === Y || e.$$typeof === pe || e.getModuleId !== void 0)) {
        var t = r.children;
        if (t !== void 0)
          if (n)
            if (q(t)) {
              for (n = 0; n < t.length; n++)
                H(t[n], e);
              Object.freeze && Object.freeze(t);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else H(t, e);
      } else
        t = "", (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (t += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), e === null ? n = "null" : q(e) ? n = "array" : e !== void 0 && e.$$typeof === N ? (n = "<" + (i(e.type) || "Unknown") + " />", t = " Did you accidentally export a JSX literal instead of a component?") : n = typeof e, console.error(
          "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          n,
          t
        );
      if (Z.call(r, "key")) {
        t = i(e);
        var f = Object.keys(r).filter(function(l) {
          return l !== "key";
        });
        n = 0 < f.length ? "{key: someKey, " + f.join(": ..., ") + ": ...}" : "{key: someKey}", ie[t + n] || (f = 0 < f.length ? "{" + f.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          n,
          t,
          f,
          t
        ), ie[t + n] = !0);
      }
      if (t = null, o !== void 0 && (b(o), t = "" + o), de(r) && (b(r.key), t = "" + r.key), "key" in r) {
        o = {};
        for (var y in r)
          y !== "key" && (o[y] = r[y]);
      } else o = r;
      return t && be(
        o,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), ge(e, t, a, u, S(), o);
    }
    function H(e, r) {
      if (typeof e == "object" && e && e.$$typeof !== we) {
        if (q(e))
          for (var o = 0; o < e.length; o++) {
            var n = e[o];
            A(n) && X(n, r);
          }
        else if (A(e))
          e._store && (e._store.validated = 1);
        else if (e === null || typeof e != "object" ? o = null : (o = L && e[L] || e["@@iterator"], o = typeof o == "function" ? o : null), typeof o == "function" && o !== e.entries && (o = o.call(e), o !== e))
          for (; !(e = o.next()).done; )
            A(e.value) && X(e.value, r);
      }
    }
    function A(e) {
      return typeof e == "object" && e !== null && e.$$typeof === N;
    }
    function X(e, r) {
      if (e._store && !e._store.validated && e.key == null && (e._store.validated = 1, r = _e(r), !se[r])) {
        se[r] = !0;
        var o = "";
        e && e._owner != null && e._owner !== S() && (o = null, typeof e._owner.tag == "number" ? o = i(e._owner.type) : typeof e._owner.name == "string" && (o = e._owner.name), o = " It was passed a child from " + o + ".");
        var n = m.getCurrentStack;
        m.getCurrentStack = function() {
          var u = O(e.type);
          return n && (u += n() || ""), u;
        }, console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          r,
          o
        ), m.getCurrentStack = n;
      }
    }
    function _e(e) {
      var r = "", o = S();
      return o && (o = i(o.type)) && (r = `

Check the render method of \`` + o + "`."), r || (e = i(e)) && (r = `

Check the top-level render call using <` + e + ">."), r;
    }
    var Te = he, N = Symbol.for("react.transitional.element"), xe = Symbol.for("react.portal"), P = Symbol.for("react.fragment"), B = Symbol.for("react.strict_mode"), Q = Symbol.for("react.profiler"), F = Symbol.for("react.consumer"), I = Symbol.for("react.context"), Y = Symbol.for("react.forward_ref"), M = Symbol.for("react.suspense"), $ = Symbol.for("react.suspense_list"), W = Symbol.for("react.memo"), U = Symbol.for("react.lazy"), ye = Symbol.for("react.offscreen"), L = Symbol.iterator, Re = Symbol.for("react.client.reference"), m = Te.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Z = Object.prototype.hasOwnProperty, g = Object.assign, pe = Symbol.for("react.client.reference"), q = Array.isArray, R = 0, K, D, ee, re, oe, te, ne;
    j.__reactDisabledLog = !0;
    var J, ae, z = !1, V = new (typeof WeakMap == "function" ? WeakMap : Map)(), we = Symbol.for("react.client.reference"), ue, le = {}, ie = {}, se = {};
    C.Fragment = P, C.jsx = function(e, r, o, n, u) {
      return G(e, r, o, !1, n, u);
    }, C.jsxs = function(e, r, o, n, u) {
      return G(e, r, o, !0, n, u);
    };
  }()), C;
}
var ve;
function Ne() {
  return ve || (ve = 1, process.env.NODE_ENV === "production" ? k.exports = Se() : k.exports = Ae()), k.exports;
}
var Ee = Ne();
const $e = ({
  children: i,
  config: T
}) => {
  const [b] = ke(
    () => new Ce({
      ...T
    })
  );
  return /* @__PURE__ */ Ee.jsxs(je, { client: b, children: [
    i,
    /* @__PURE__ */ Ee.jsx(Oe, { initialIsOpen: !1 })
  ] });
};
export {
  $e as QueryProvider
};

import { c as s, T as c, P as u, a as i, b as m, C as P, Q as d } from "./B4MFY5CR-C1v_dF37.js";
import { g as v, c as C, a as e } from "./index-Ltfixiyp.js";
var h = (t) => {
  const [r, o] = s({
    prefix: "TanstackQueryDevtools"
  }), a = v(), l = C(() => {
    const n = r.theme_preference || c;
    return n !== "system" ? n : a();
  });
  return e(d.Provider, {
    value: t,
    get children() {
      return e(u, {
        disabled: !0,
        localStore: r,
        setLocalStore: o,
        get children() {
          return e(i.Provider, {
            value: l,
            get children() {
              return e(m, {
                get children() {
                  return e(P, {
                    localStore: r,
                    setLocalStore: o,
                    get onClose() {
                      return t.onClose;
                    },
                    showPanelViewOnly: !0
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}, p = h;
export {
  p as default
};

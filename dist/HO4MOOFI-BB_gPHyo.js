import { c, T as l, P as m, a as u, D as v, Q as i } from "./B4MFY5CR-C1v_dF37.js";
import { g as d, c as f, a as e } from "./index-Ltfixiyp.js";
var p = (a) => {
  const [r, t] = c({
    prefix: "TanstackQueryDevtools"
  }), n = d(), s = f(() => {
    const o = r.theme_preference || l;
    return o !== "system" ? o : n();
  });
  return e(i.Provider, {
    value: a,
    get children() {
      return e(m, {
        localStore: r,
        setLocalStore: t,
        get children() {
          return e(u.Provider, {
            value: s,
            get children() {
              return e(v, {
                localStore: r,
                setLocalStore: t
              });
            }
          });
        }
      });
    }
  });
}, C = p;
export {
  C as default
};

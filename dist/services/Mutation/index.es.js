import { HttpClient as h } from "../HttpClient/index.es.js";
var s = Object.defineProperty, i = (r, t, e) => t in r ? s(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, a = (r, t, e) => i(r, typeof t != "symbol" ? t + "" : t, e);
class n {
  constructor(t) {
    a(this, "http"), a(this, "pathname"), this.http = h.getInstance(), this.pathname = t;
  }
  mutate(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: t
      },
      e
    );
  }
  executeAction(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/actions/${t.action}`,
        data: t.params
      },
      e
    );
  }
  delete(t, e = {}) {
    return this.http.request(
      {
        method: "DELETE",
        url: this.pathname,
        data: t
      },
      e
    );
  }
  forceDelete(t, e = {}) {
    return this.http.request(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: t
      },
      e
    );
  }
  restore(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: t
      },
      e
    );
  }
}
export {
  n as Mutation
};

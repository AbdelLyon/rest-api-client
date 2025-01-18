import { HttpClient as a } from "../HttpClient/index.es.js";
var h = Object.defineProperty, i = (r, t, e) => t in r ? h(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, s = (r, t, e) => i(r, typeof t != "symbol" ? t + "" : t, e);
class u {
  constructor(t) {
    s(this, "http"), s(this, "pathname"), this.http = a.getInstance(), this.pathname = t;
  }
  searchRequest(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/search`,
        data: { search: t }
      },
      e
    );
  }
  async search(t, e = {}) {
    return (await this.searchRequest(t, e)).data;
  }
  searchPaginate(t, e = {}) {
    return this.searchRequest(t, e);
  }
  getdetails(t = {}) {
    return this.http.request(
      {
        method: "GET",
        url: this.pathname
      },
      t
    );
  }
}
export {
  u as Query
};

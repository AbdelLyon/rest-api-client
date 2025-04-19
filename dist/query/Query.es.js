var h = Object.defineProperty;
var i = (r, t, e) => t in r ? h(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var s = (r, t, e) => i(r, typeof t != "symbol" ? t + "" : t, e);
import { HttpClient as n } from "../http/HttpClient.es.js";
class u {
  constructor(t, e) {
    s(this, "http");
    s(this, "pathname");
    s(this, "schema");
    this.http = n.getInstance(), this.pathname = t, this.schema = e;
  }
  validateData(t) {
    return t.map((e) => {
      const a = this.schema.safeParse(e);
      if (!a.success)
        throw console.error("Type validation failed:", a.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(a.error.errors)}`
        );
      return a.data;
    });
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
    const a = await this.searchRequest(t, e);
    return this.validateData(a.data);
  }
  async searchPaginate(t, e = {}) {
    const a = await this.searchRequest(t, e);
    return {
      ...a,
      data: this.validateData(a.data)
    };
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
//# sourceMappingURL=Query.es.js.map

var n = Object.defineProperty;
var o = (r, t, e) => t in r ? n(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var s = (r, t, e) => o(r, typeof t != "symbol" ? t + "" : t, e);
import { HttpClient as h } from "../http/HttpClient.es.js";
import { Builder as i } from "./Builder.es.js";
class p {
  constructor(t, e) {
    s(this, "http");
    s(this, "pathname");
    s(this, "schema");
    s(this, "relation");
    this.http = h.getInstance(), this.pathname = t, this.schema = e, this.relation = i.getRelationBuilder();
  }
  entityBuilder() {
    const t = i.createEntityBuilder(this.relation);
    return t.setMutationFunction((e, a) => this.mutate(e, a)), t;
  }
  relationBuilder() {
    return this.relation;
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
  async mutate(t, e) {
    const a = "build" in t ? t.build() : t;
    return await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: a
      },
      e
    );
  }
  executeAction(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/actions/${t.action}`,
        data: t.payload
      },
      e
    );
  }
  async delete(t, e = {}) {
    const a = await this.http.request(
      {
        method: "DELETE",
        url: this.pathname,
        data: t
      },
      e
    );
    return {
      ...a,
      data: this.validateData(a.data)
    };
  }
  async forceDelete(t, e = {}) {
    const a = await this.http.request(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: t
      },
      e
    );
    return {
      ...a,
      data: this.validateData(a.data)
    };
  }
  async restore(t, e = {}) {
    const a = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: t
      },
      e
    );
    return {
      ...a,
      data: this.validateData(a.data)
    };
  }
}
export {
  p as Mutation
};

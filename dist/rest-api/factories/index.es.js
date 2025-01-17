import { Injectable as p, Inject as v, TOKENS as i, Container as s } from "../di/index.es.js";
import { MutationService as q, ApiRequestService as h } from "../services/index.es.js";
var l = Object.defineProperty, R = Object.getOwnPropertyDescriptor, I = (t, e, r, c) => {
  for (var a = c > 1 ? void 0 : c ? R(e, r) : e, u = t.length - 1, n; u >= 0; u--)
    (n = t[u]) && (a = (c ? n(e, r, a) : n(a)) || a);
  return c && a && l(e, r, a), a;
}, S = (t, e) => (r, c) => e(r, c, t);
let o = class {
  constructor(t) {
    if (this.apiRequest = t, this.apiRequest !== void 0)
      throw new Error("ApiRequest is required");
  }
  searchRequest(t, e = {}) {
    return this.apiRequest.request(
      {
        method: "POST",
        url: "/search",
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
    return this.apiRequest.request(
      {
        method: "GET",
        url: ""
      },
      t
    );
  }
};
o = I([
  p(),
  S(0, v(i.IApiRequest))
], o);
class d {
  static create(e) {
    return s.bind(i.IApiRequest).toInstance(e), s.bind(i.IQuery).to(o), s.resolve(i.IQuery);
  }
}
class y {
  static create(e) {
    return s.bind(i.IApiRequest).toInstance(e), s.bind(i.IMutation).to(q), s.resolve(i.IMutation);
  }
}
class A {
  static create(e) {
    return s.reset(), s.bind(i.IHttpConfig).toInstance(e), s.bind(i.IApiRequest).to(h), s.resolve(i.IApiRequest);
  }
}
class m {
  static createApiRequest(e) {
    return A.create(e);
  }
  static createQueryService(e) {
    return d.create(e);
  }
  static createMutationService(e) {
    return y.create(e);
  }
  static createAll(e) {
    const r = this.createApiRequest(e);
    return {
      apiRequest: r,
      queryService: this.createQueryService(r),
      mutationService: this.createMutationService(r)
    };
  }
}
export {
  A as ApiRequestServiceFactory,
  y as MutationServiceFactory,
  d as QueryServiceFactory,
  m as ServiceFactory
};

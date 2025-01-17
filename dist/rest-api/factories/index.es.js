import { I as p, a as q, T as a } from "../../tokens-DbFzGZEv.js";
import { Container as s } from "../di/index.es.js";
import { M as h, A as l } from "../../ApiRequest-D7o1Yy01.js";
var R = Object.defineProperty, I = Object.getOwnPropertyDescriptor, v = (t, e, r, c) => {
  for (var i = c > 1 ? void 0 : c ? I(e, r) : e, u = t.length - 1, n; u >= 0; u--)
    (n = t[u]) && (i = (c ? n(e, r, i) : n(i)) || i);
  return c && i && R(e, r, i), i;
}, d = (t, e) => (r, c) => e(r, c, t);
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
o = v([
  p(),
  d(0, q(a.IApiRequest))
], o);
class y {
  static create(e) {
    return s.bind(a.IApiRequest).toInstance(e), s.bind(a.IQuery).to(o), s.resolve(a.IQuery);
  }
}
class A {
  static create(e) {
    return s.bind(a.IApiRequest).toInstance(e), s.bind(a.IMutation).to(h), s.resolve(a.IMutation);
  }
}
class f {
  static create(e) {
    return s.reset(), s.bind(a.IHttpConfig).toInstance(e), s.bind(a.IApiRequest).to(l), s.resolve(a.IApiRequest);
  }
}
class M {
  static createApiRequest(e) {
    return f.create(e);
  }
  static createQuery(e) {
    return y.create(e);
  }
  static createMutation(e) {
    return A.create(e);
  }
  static createAll(e) {
    const r = this.createApiRequest(e);
    return {
      apiRequest: r,
      queryService: this.createQuery(r),
      mutationService: this.createMutation(r)
    };
  }
}
export {
  f as ApiRequesteFactory,
  A as MutationFactory,
  y as QueryFactory,
  M as ServiceFactory
};

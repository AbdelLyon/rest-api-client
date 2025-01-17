import { I as p, a as h, T as s } from "../../tokens-A-CxIPtm.js";
import { Container as a } from "../di/index.es.js";
import { M as l, H as q } from "../../Http-Dq3y9Co0.js";
var I = Object.defineProperty, v = Object.getOwnPropertyDescriptor, d = (e, t, r, c) => {
  for (var i = c > 1 ? void 0 : c ? v(t, r) : t, n = e.length - 1, u; n >= 0; n--)
    (u = e[n]) && (i = (c ? u(t, r, i) : u(i)) || i);
  return c && i && I(t, r, i), i;
}, y = (e, t) => (r, c) => t(r, c, e);
let o = class {
  constructor(e) {
    if (this.apiRequest = e, this.apiRequest !== void 0)
      throw new Error("ApiRequest is required");
  }
  searchRequest(e, t = {}) {
    return this.apiRequest.request(
      {
        method: "POST",
        url: "/search",
        data: { search: e }
      },
      t
    );
  }
  async search(e, t = {}) {
    return (await this.searchRequest(e, t)).data;
  }
  searchPaginate(e, t = {}) {
    return this.searchRequest(e, t);
  }
  getdetails(e = {}) {
    return this.apiRequest.request(
      {
        method: "GET",
        url: ""
      },
      e
    );
  }
};
o = d([
  p(),
  y(0, h(s.IHttp))
], o);
class R {
  static create(t) {
    return a.bind(s.IHttp).toInstance(t), a.bind(s.IQuery).to(o), a.resolve(s.IQuery);
  }
}
class f {
  static create(t) {
    return a.bind(s.IHttp).toInstance(t), a.bind(s.IMutation).to(l), a.resolve(s.IMutation);
  }
}
class m {
  static create(t) {
    return a.reset(), a.bind(s.IHttpConfig).toInstance(t), a.bind(s.IHttp).to(q), a.resolve(s.IHttp);
  }
}
class M {
  static createApiRequest(t) {
    return m.create(t);
  }
  static createQuery(t) {
    return R.create(t);
  }
  static createMutation(t) {
    return f.create(t);
  }
  static createAll(t) {
    const r = this.createApiRequest(t);
    return {
      apiRequest: r,
      queryService: this.createQuery(r),
      mutationService: this.createMutation(r)
    };
  }
}
export {
  m as ApiRequesteFactory,
  f as MutationFactory,
  R as QueryFactory,
  M as ServiceFactory
};

import { I as h, a as l, T as f } from "../../tokens-DbFzGZEv.js";
var m = Object.defineProperty, d = Object.getOwnPropertyDescriptor, E = (t, e, r, o) => {
  for (var s = o > 1 ? void 0 : o ? d(e, r) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (s = (o ? n(e, r, s) : n(s)) || s);
  return o && s && m(e, r, s), s;
}, q = (t, e) => (r, o) => e(r, o, t);
let c = class {
  constructor(t) {
    this.apiRequest = t;
  }
  mutate(t, e = {}) {
    return this.apiRequest.request(
      {
        method: "POST",
        url: "/mutate",
        data: t
      },
      e
    );
  }
  executeAction(t, e = {}) {
    return this.apiRequest.request(
      {
        method: "POST",
        url: `/actions/${t.action}`,
        data: t.params
      },
      e
    );
  }
  delete(t, e = {}) {
    return this.apiRequest.request(
      {
        method: "DELETE",
        url: "",
        data: t
      },
      e
    );
  }
  forceDelete(t, e = {}) {
    return this.apiRequest.request(
      {
        method: "DELETE",
        url: "/force",
        data: t
      },
      e
    );
  }
  restore(t, e = {}) {
    return this.apiRequest.request(
      {
        method: "POST",
        url: "/restore",
        data: t
      },
      e
    );
  }
};
c = E([
  h(),
  q(0, l(f.IApiRequest))
], c);
var _ = Object.defineProperty, I = Object.getOwnPropertyDescriptor, g = (t, e, r) => e in t ? _(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, P = (t, e, r, o) => {
  for (var s = o > 1 ? void 0 : o ? I(e, r) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (s = (o ? n(e, r, s) : n(s)) || s);
  return o && s && _(e, r, s), s;
}, v = (t, e) => (r, o) => e(r, o, t), i = (t, e, r) => g(t, typeof e != "symbol" ? e + "" : e, r);
class u extends Error {
  constructor(e, r) {
    super("API Service Request Failed"), this.originalError = e, this.requestConfig = r, this.name = "ApiRequestError";
  }
}
let p = class {
  constructor(t) {
    this.httpConfig = t, i(this, "DEFAULT_REQUEST_OPTIONS", {
      timeout: 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }), i(this, "successInterceptor", (e) => e), i(this, "errorInterceptor", (e) => {
      throw this.logError(e), new u(e, e.config || {});
    }), this.httpConfig === null && this.setupApiInterceptors();
  }
  setupApiInterceptors() {
    this.httpConfig.getAxiosInstance().interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor
    );
  }
  logError(t) {
    var e, r, o, s;
    console.error("API Request Error", {
      url: (e = t.config) == null ? void 0 : e.url,
      method: (r = t.config) == null ? void 0 : r.method,
      status: (o = t.response) == null ? void 0 : o.status,
      data: (s = t.response) == null ? void 0 : s.data,
      message: t.message
    });
  }
  async request(t, e = {}) {
    try {
      const r = {
        ...this.DEFAULT_REQUEST_OPTIONS,
        ...t,
        ...e
      };
      return (await this.httpConfig.getAxiosInstance().request(r)).data;
    } catch (r) {
      throw r instanceof u ? r : new u(r, t);
    }
  }
};
p = P([
  h(),
  v(0, l(f.IHttpConfig))
], p);
export {
  p as ApiRequest,
  c as Mutation
};

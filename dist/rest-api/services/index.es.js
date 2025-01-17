import { Injectable as l, Inject as f, TOKENS as p, Container as m } from "../di/index.es.js";
var d = Object.defineProperty, q = Object.getOwnPropertyDescriptor, E = (t, e, r, o) => {
  for (var s = o > 1 ? void 0 : o ? q(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (s = (o ? n(e, r, s) : n(s)) || s);
  return o && s && d(e, r, s), s;
}, I = (t, e) => (r, o) => e(r, o, t);
let h = class {
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
h = E([
  l(),
  I(0, f(p.IApiRequest))
], h);
var _ = Object.defineProperty, g = Object.getOwnPropertyDescriptor, v = (t, e, r) => e in t ? _(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, P = (t, e, r, o) => {
  for (var s = o > 1 ? void 0 : o ? g(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (s = (o ? n(e, r, s) : n(s)) || s);
  return o && s && _(e, r, s), s;
}, O = (t, e) => (r, o) => e(r, o, t), a = (t, e, r) => v(t, typeof e != "symbol" ? e + "" : e, r);
class u extends Error {
  constructor(e, r) {
    super("API Service Request Failed"), this.originalError = e, this.requestConfig = r, this.name = "ApiRequestError";
  }
}
let c = class {
  constructor(t) {
    this.httpConfig = t, a(this, "DEFAULT_REQUEST_OPTIONS", {
      timeout: 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }), a(this, "successInterceptor", (e) => e), a(this, "errorInterceptor", (e) => {
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
c = P([
  l(),
  O(0, f(p.IHttpConfig))
], c);
m.bind(p.IApiRequest).to(c);
export {
  c as ApiRequestService,
  h as MutationService
};

import { I as f, a as I, T as d } from "./tokens-A-CxIPtm.js";
import n from "axios-retry";
import _ from "axios";
var E = Object.defineProperty, R = Object.getOwnPropertyDescriptor, x = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? R(e, r) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && E(e, r, s), s;
}, P = (t, e) => (r, a) => e(r, a, t);
let u = class {
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
u = x([
  f(),
  P(0, I(d.IHttp))
], u);
var g = Object.defineProperty, q = (t, e, r) => e in t ? g(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, l = (t, e, r) => q(t, typeof e != "symbol" ? e + "" : e, r);
class A {
  constructor(e, r) {
    this.domain = e, this.baseUrl = r, l(this, "axiosInstance"), l(this, "MAX_RETRIES", 3), this.axiosInstance = this.createAxiosInstance(), this.setupInterceptors(), this.configureRetry();
  }
  getAxiosInstance() {
    return this.axiosInstance;
  }
  setAxiosInstance(e) {
    this.axiosInstance = e;
  }
  getFullBaseUrl() {
    return `https://local-${this.domain}-api.xefi-apps.fr/api/${this.baseUrl}`;
  }
  createAxiosInstance() {
    return _.create({
      baseURL: this.getFullBaseUrl(),
      timeout: 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      withCredentials: !0
    });
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (e) => e,
      (e) => Promise.reject(e)
    ), this.axiosInstance.interceptors.response.use(
      (e) => e,
      this.handleErrorResponse.bind(this)
    );
  }
  configureRetry() {
    n(this.axiosInstance, {
      retries: this.MAX_RETRIES,
      retryDelay: n.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(e) {
    var r;
    return n.isNetworkOrIdempotentRequestError(e) || ((r = e.response) == null ? void 0 : r.status) === 429;
  }
  handleErrorResponse(e) {
    return Promise.reject(e);
  }
}
var m = Object.defineProperty, b = Object.getOwnPropertyDescriptor, O = (t, e, r) => e in t ? m(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, v = (t, e, r, a) => {
  for (var s = a > 1 ? void 0 : a ? b(e, r) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (s = (a ? i(e, r, s) : i(s)) || s);
  return a && s && m(e, r, s), s;
}, c = (t, e, r) => O(t, typeof e != "symbol" ? e + "" : e, r);
class p extends Error {
  constructor(e, r) {
    super("API Service Request Failed"), this.originalError = e, this.requestConfig = r, this.name = "ApiRequestError";
  }
}
let h = class extends A {
  constructor(t, e) {
    super(t, e), c(this, "DEFAULT_REQUEST_OPTIONS", {
      timeout: 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }), c(this, "successInterceptor", (r) => r), c(this, "errorInterceptor", (r) => {
      throw this.logError(r), new p(r, r.config || {});
    }), this.setupApiInterceptors();
  }
  setupApiInterceptors() {
    this.getAxiosInstance().interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor
    );
  }
  logError(t) {
    var e, r, a, s;
    console.error("API Request Error", {
      url: (e = t.config) == null ? void 0 : e.url,
      method: (r = t.config) == null ? void 0 : r.method,
      status: (a = t.response) == null ? void 0 : a.status,
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
      return (await this.getAxiosInstance().request(
        r
      )).data;
    } catch (r) {
      throw r instanceof p ? r : new p(r, t);
    }
  }
};
h = v([
  f()
], h);
export {
  h as H,
  u as M,
  A as a
};

import { A, M as E } from "../../ApiRequest-D7o1Yy01.js";
import { I as u } from "../../tokens-DbFzGZEv.js";
import h from "axios";
import a from "axios-retry";
var l = Object.defineProperty, I = Object.getOwnPropertyDescriptor, f = (e, t, s) => t in e ? l(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s, x = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? I(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && l(t, s, r), r;
}, p = (e, t, s) => f(e, typeof t != "symbol" ? t + "" : t, s);
let c = class {
  constructor(e, t) {
    this.domain = e, this.baseUrl = t, p(this, "axiosInstance"), p(this, "MAX_RETRIES", 3), this.axiosInstance = this.createAxiosInstance(), this.setupInterceptors(), this.configureRetry();
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
    return h.create({
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
    a(this.axiosInstance, {
      retries: this.MAX_RETRIES,
      retryDelay: a.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(e) {
    var t;
    return a.isNetworkOrIdempotentRequestError(e) || ((t = e.response) == null ? void 0 : t.status) === 429;
  }
  handleErrorResponse(e) {
    return Promise.reject(e);
  }
};
c = x([
  u()
], c);
export {
  A as ApiRequest,
  c as HttpConfig,
  E as Mutation
};

import n from "axios-retry";
import d from "axios";
var f = Object.defineProperty,
  g = (s, t, e) =>
    t in s
      ? f(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
      : (s[t] = e),
  o = (s, t, e) => g(s, typeof t != "symbol" ? t + "" : t, e);
class i extends Error {
  constructor(t, e) {
    super("API Service Request Failed"),
      (this.originalError = t),
      (this.requestConfig = e),
      (this.name = "ApiRequestError");
  }
}
const p = class l {
  constructor() {
    o(this, "axiosInstance"), o(this, "maxRetries");
  }
  static init(t) {
    return (
      this.instance ||
        ((this.instance = new l()),
        (this.instance.maxRetries = t.maxRetries ?? 3),
        (this.instance.axiosInstance = this.instance.createAxiosInstance(t)),
        this.instance.setupInterceptors(),
        this.instance.configureRetry()),
      this.instance
    );
  }
  static getInstance() {
    if (!this.instance)
      throw new Error("Http not initialized. Call Http.init() first.");
    return this.instance;
  }
  getAxiosInstance() {
    return this.axiosInstance;
  }
  setAxiosInstance(t) {
    this.axiosInstance = t;
  }
  getFullBaseUrl(t) {
    return t.baseURL;
  }
  createAxiosInstance(t) {
    const e = {
      baseURL: this.getFullBaseUrl(t),
      timeout: t.timeout ?? 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...t.headers,
      },
      withCredentials: t.withCredentials ?? !0,
    };
    return d.create(e);
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (t) => t,
      (t) => Promise.reject(t),
    ),
      this.axiosInstance.interceptors.response.use(
        (t) => t,
        this.handleErrorResponse.bind(this),
      );
  }
  configureRetry() {
    n(this.axiosInstance, {
      retries: this.maxRetries,
      retryDelay: n.exponentialDelay,
      retryCondition: this.isRetryableError,
    });
  }
  isRetryableError(t) {
    var e;
    return (
      n.isNetworkOrIdempotentRequestError(t) ||
      ((e = t.response) == null ? void 0 : e.status) === 429
    );
  }
  handleErrorResponse(t) {
    return this.logError(t), Promise.reject(new i(t, t.config || {}));
  }
  logError(t) {
    var e, r, a, h;
    console.error("API Request Error", {
      url: (e = t.config) == null ? void 0 : e.url,
      method: (r = t.config) == null ? void 0 : r.method,
      status: (a = t.response) == null ? void 0 : a.status,
      data: (h = t.response) == null ? void 0 : h.data,
      message: t.message,
    });
  }
  async request(t, e = {}) {
    try {
      const r = {
        timeout: 1e4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        ...t,
        ...e,
      };
      return (await this.axiosInstance.request(r)).data;
    } catch (r) {
      throw r instanceof i ? r : new i(r, t);
    }
  }
  _setAxiosInstanceForTesting(t) {
    this.axiosInstance = t;
  }
};
o(p, "instance");
let m = p;
var x = Object.defineProperty,
  I = (s, t, e) =>
    t in s
      ? x(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
      : (s[t] = e),
  c = (s, t, e) => I(s, typeof t != "symbol" ? t + "" : t, e);
class P {
  constructor(t) {
    c(this, "http"),
      c(this, "pathname"),
      (this.http = m.getInstance()),
      (this.pathname = t);
  }
  mutate(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: t,
      },
      e,
    );
  }
  executeAction(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/actions/${t.action}`,
        data: t.params,
      },
      e,
    );
  }
  delete(t, e = {}) {
    return this.http.request(
      {
        method: "DELETE",
        url: this.pathname,
        data: t,
      },
      e,
    );
  }
  forceDelete(t, e = {}) {
    return this.http.request(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: t,
      },
      e,
    );
  }
  restore(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: t,
      },
      e,
    );
  }
}
var E = Object.defineProperty,
  R = (s, t, e) =>
    t in s
      ? E(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
      : (s[t] = e),
  u = (s, t, e) => R(s, typeof t != "symbol" ? t + "" : t, e);
class b {
  constructor(t) {
    u(this, "http"),
      u(this, "pathname"),
      (this.http = m.getInstance()),
      (this.pathname = t);
  }
  searchRequest(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/search`,
        data: { search: t },
      },
      e,
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
        url: this.pathname,
      },
      t,
    );
  }
}
export { m as HttpClient, P as Mutation, b as Query };

import h from "axios";
import o from "axios-retry";
var l = Object.defineProperty, d = (s, e, t) => e in s ? l(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, i = (s, e, t) => d(s, typeof e != "symbol" ? e + "" : e, t);
class m {
  constructor(e, t) {
    i(this, "axiosInstance"), i(this, "domain"), i(this, "baseUrl"), i(this, "MAX_RETRIES", 3), this.domain = e, this.baseUrl = t, this.axiosInstance = this.createAxiosInstance(), this.setupInterceptors(), this.configureRetry();
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
  getFullBaseUrl() {
    return `https://local-${this.domain}-api.xefi-apps.fr/api/${this.baseUrl}`;
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
    o(this.axiosInstance, {
      retries: this.MAX_RETRIES,
      retryDelay: o.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(e) {
    var t;
    return o.isNetworkOrIdempotentRequestError(e) || ((t = e.response) == null ? void 0 : t.status) === 429;
  }
  handleErrorResponse(e) {
    return Promise.reject(e);
  }
  setAxiosInstance(e) {
    this.axiosInstance = e;
  }
}
var I = Object.defineProperty, x = (s, e, t) => e in s ? I(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, a = (s, e, t) => x(s, typeof e != "symbol" ? e + "" : e, t);
class c extends Error {
  constructor(e, t) {
    super("API Service Request Failed"), this.originalError = e, this.requestConfig = t, this.name = "ApiServiceError";
  }
}
class p extends m {
  constructor(e, t) {
    super(e, t), this.domain = e, this.pathname = t, a(this, "DEFAULT_REQUEST_OPTIONS", {
      timeout: 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }), a(this, "successInterceptor", (r) => r), a(this, "errorInterceptor", (r) => {
      throw this.logError(r), new c(r, r.config || {});
    }), this.setupApiInterceptors();
  }
  setupApiInterceptors() {
    this.axiosInstance.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor
    );
  }
  logError(e) {
    var t, r, n, u;
    console.error("API Request Error", {
      url: (t = e.config) == null ? void 0 : t.url,
      method: (r = e.config) == null ? void 0 : r.method,
      status: (n = e.response) == null ? void 0 : n.status,
      data: (u = e.response) == null ? void 0 : u.data,
      message: e.message
    });
  }
  async request(e, t = {}) {
    try {
      const r = {
        ...this.DEFAULT_REQUEST_OPTIONS,
        ...e,
        ...t
      };
      return (await this.axiosInstance.request(
        r
      )).data;
    } catch (r) {
      throw r instanceof c ? r : new c(r, e);
    }
  }
  _setAxiosInstanceForTesting(e) {
    this.axiosInstance = e;
  }
}
class g extends p {
  constructor(e, t) {
    super(e, t);
  }
  searchRequest(e, t = {}) {
    return this.request(
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
    return this.request(
      {
        method: "GET",
        url: ""
      },
      e
    );
  }
}
class R extends p {
  constructor(e, t) {
    super(e, t);
  }
  mutate(e, t = {}) {
    return this.request(
      {
        method: "POST",
        url: "/mutate",
        data: e
      },
      t
    );
  }
  executeAction(e, t = {}) {
    return this.request(
      {
        method: "POST",
        url: `/actions/${e.action}`,
        data: e.params
      },
      t
    );
  }
}
export {
  p as ApiService,
  m as HttpService,
  R as MutationService,
  g as QueryService
};

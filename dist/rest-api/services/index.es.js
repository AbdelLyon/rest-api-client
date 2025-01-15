import p from "axios";
import n from "axios-retry";
var l = Object.defineProperty, d = (r, e, t) => e in r ? l(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, i = (r, e, t) => d(r, typeof e != "symbol" ? e + "" : e, t);
class m {
  constructor(e, t) {
    i(this, "axiosInstance"), i(this, "domain"), i(this, "baseUrl"), i(this, "MAX_RETRIES", 3), this.domain = e, this.baseUrl = t, this.axiosInstance = this.createAxiosInstance(), this.setupInterceptors(), this.configureRetry();
  }
  createAxiosInstance() {
    return p.create({
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
    n(this.axiosInstance, {
      retries: this.MAX_RETRIES,
      retryDelay: n.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(e) {
    var t;
    return n.isNetworkOrIdempotentRequestError(e) || ((t = e.response) == null ? void 0 : t.status) === 429;
  }
  handleErrorResponse(e) {
    return Promise.reject(e);
  }
  setAxiosInstance(e) {
    this.axiosInstance = e;
  }
}
var E = Object.defineProperty, I = (r, e, t) => e in r ? E(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, a = (r, e, t) => I(r, typeof e != "symbol" ? e + "" : e, t);
class c extends Error {
  constructor(e, t) {
    super("API Service Request Failed"), this.originalError = e, this.requestConfig = t, this.name = "ApiServiceError";
  }
}
class h extends m {
  constructor(e, t) {
    super(e, t), this.domain = e, this.pathname = t, a(this, "DEFAULT_REQUEST_OPTIONS", {
      timeout: 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }), a(this, "successInterceptor", (s) => s), a(this, "errorInterceptor", (s) => {
      throw this.logError(s), new c(s, s.config || {});
    }), this.setupApiInterceptors();
  }
  setupApiInterceptors() {
    this.axiosInstance.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor
    );
  }
  logError(e) {
    var t, s, o, u;
    console.error("API Request Error", {
      url: (t = e.config) == null ? void 0 : t.url,
      method: (s = e.config) == null ? void 0 : s.method,
      status: (o = e.response) == null ? void 0 : o.status,
      data: (u = e.response) == null ? void 0 : u.data,
      message: e.message
    });
  }
  async request(e, t = {}) {
    try {
      const s = {
        ...this.DEFAULT_REQUEST_OPTIONS,
        ...e,
        ...t
      };
      return (await this.axiosInstance.request(
        s
      )).data;
    } catch (s) {
      throw s instanceof c ? s : new c(s, e);
    }
  }
  _setAxiosInstanceForTesting(e) {
    this.axiosInstance = e;
  }
}
class g extends h {
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
class R extends h {
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
  delete(e, t = {}) {
    return this.request(
      {
        method: "DELETE",
        url: "",
        data: e
      },
      t
    );
  }
  forceDelete(e, t = {}) {
    return this.request(
      {
        method: "DELETE",
        url: "/force",
        data: e
      },
      t
    );
  }
  restore(e, t = {}) {
    return this.request(
      {
        method: "POST",
        url: "/restore",
        data: e
      },
      t
    );
  }
}
export {
  h as ApiService,
  m as HttpService,
  R as MutationService,
  g as QueryService
};

import l from "axios";
import o from "axios-retry";
var d = Object.defineProperty, I = (r, e, t) => e in r ? d(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, n = (r, e, t) => I(r, typeof e != "symbol" ? e + "" : e, t);
class f {
  constructor(e, t) {
    n(this, "axiosInstance"), n(this, "domain"), n(this, "baseUrl"), n(this, "MAX_RETRIES", 3), this.domain = e, this.baseUrl = t, this.axiosInstance = this.createAxiosInstance(), this.setupInterceptors(), this.configureRetry();
  }
  createAxiosInstance() {
    return l.create({
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
var m = Object.defineProperty, _ = (r, e, t) => e in r ? m(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, a = (r, e, t) => _(r, typeof e != "symbol" ? e + "" : e, t);
class c extends Error {
  constructor(e, t) {
    super("API Service Request Failed"), this.originalError = e, this.requestConfig = t, this.name = "ApiServiceError";
  }
}
class x extends f {
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
    var t, s, i, p;
    console.error("API Request Error", {
      url: (t = e.config) == null ? void 0 : t.url,
      method: (s = e.config) == null ? void 0 : s.method,
      status: (i = e.response) == null ? void 0 : i.status,
      data: (p = e.response) == null ? void 0 : p.data,
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
  search(e, t = {}) {
    return this.request(
      {
        method: "POST",
        url: "/search",
        data: { search: e }
      },
      t
    );
  }
  mutate(e, t = {}) {
    return this.request(
      {
        method: "POST",
        url: "/mutate",
        data: { mutate: e }
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
  customRequest(e, t, s, i = {}) {
    return this.request({ method: e, url: t, data: s }, i);
  }
  _setAxiosInstanceForTesting(e) {
    this.axiosInstance = e;
  }
}
var E = Object.defineProperty, g = (r, e, t) => e in r ? E(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, b = (r, e, t) => g(r, e + "", t);
const h = class u extends x {
  constructor(e, t) {
    super(e, t);
  }
  static getInstance(e, t) {
    const s = `${e}:${t}`;
    return this.instances.has(s) || this.instances.set(s, new u(e, t)), this.instances.get(s) ?? new u(e, t);
  }
  static resetInstance(e, t) {
    if (e !== void 0 && e !== "" && t !== void 0 && t !== "") {
      const s = `${e}:${t}`;
      this.instances.delete(s);
    } else
      this.instances.clear();
  }
};
b(h, "instances", /* @__PURE__ */ new Map());
let R = h;
export {
  x as ApiService,
  f as HttpService,
  R as UserService
};

import i from "axios-retry";
import m from "axios";
class n extends Error {
  constructor(t, e) {
    super("API Service Request Failed"), this.originalError = t, this.requestConfig = e, this.name = "ApiRequestError";
  }
}
var f = Object.defineProperty, g = (s, t, e) => t in s ? f(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e, c = (s, t, e) => g(s, typeof t != "symbol" ? t + "" : t, e);
const l = class p {
  constructor() {
    c(this, "axiosInstance"), c(this, "maxRetries");
  }
  static init(t) {
    return this.instance || (this.instance = new p(), this.instance.maxRetries = t.maxRetries ?? 3, this.instance.axiosInstance = this.instance.createAxiosInstance(t), this.instance.setupInterceptors(), this.instance.configureRetry()), this.instance;
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
    if (!t.baseURL)
      throw new Error("baseURL is required in HttpConfigOptions");
    let e = t.baseURL.trim();
    if (e.endsWith("/") && (e = e.slice(0, -1)), t.apiPrefix) {
      let r = t.apiPrefix.trim();
      return r.startsWith("/") || (r = "/" + r), r.endsWith("/") && (r = r.slice(0, -1)), e + r;
    }
    return t.apiVersion ? `${e}/v${t.apiVersion}` : e;
  }
  createAxiosInstance(t) {
    const e = {
      baseURL: this.getFullBaseUrl(t),
      timeout: t.timeout ?? 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...t.headers
      },
      withCredentials: t.withCredentials ?? !0
    };
    return m.create(e);
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (t) => t,
      (t) => Promise.reject(t)
    ), this.axiosInstance.interceptors.response.use(
      (t) => t,
      this.handleErrorResponse.bind(this)
    );
  }
  configureRetry() {
    i(this.axiosInstance, {
      retries: this.maxRetries,
      retryDelay: i.exponentialDelay,
      retryCondition: this.isRetryableError.bind(this)
    });
  }
  // Rendons cette méthode non-privée pour faciliter les tests
  // Vous pouvez aussi la laisser privée et utiliser des techniques d'accès via l'indexation dans les tests
  isRetryableError(t) {
    var e;
    return i.isNetworkOrIdempotentRequestError(t) || ((e = t.response) == null ? void 0 : e.status) === 429;
  }
  handleErrorResponse(t) {
    return this.logError(t), Promise.reject(new n(t, t.config || {}));
  }
  // Rendons cette méthode non-privée pour faciliter les tests
  logError(t) {
    var e, r, a, u;
    console.error("API Request Error", {
      url: (e = t.config) == null ? void 0 : e.url,
      method: (r = t.config) == null ? void 0 : r.method,
      status: (a = t.response) == null ? void 0 : a.status,
      data: (u = t.response) == null ? void 0 : u.data,
      message: t.message
    });
  }
  async request(t, e = {}) {
    try {
      const r = {
        timeout: 1e4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        ...t,
        ...e
      };
      return (await this.axiosInstance.request(
        r
      )).data;
    } catch (r) {
      throw r instanceof n ? r : new n(r, t);
    }
  }
  static resetInstance() {
    this.instance && (this.instance = void 0);
  }
};
c(l, "instance");
let d = l;
var w = Object.defineProperty, x = (s, t, e) => t in s ? w(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e, o = (s, t, e) => x(s, typeof t != "symbol" ? t + "" : t, e);
class b {
  constructor(t, e) {
    o(this, "http"), o(this, "pathname"), o(this, "schema"), this.http = d.getInstance(), this.pathname = t, this.schema = e;
  }
  validateData(t) {
    return t.map((e) => {
      const r = this.schema.safeParse(e);
      if (!r.success)
        throw console.error("Type validation failed:", r.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(r.error.errors)}`
        );
      return r.data;
    });
  }
  async mutate(t, e = {}) {
    const r = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: t
      },
      e
    );
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
  executeAction(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/actions/${t.action}`,
        data: t.payload
      },
      e
    );
  }
  async delete(t, e = {}) {
    const r = await this.http.request(
      {
        method: "DELETE",
        url: this.pathname,
        data: t
      },
      e
    );
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
  async forceDelete(t, e = {}) {
    const r = await this.http.request(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: t
      },
      e
    );
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
  async restore(t, e = {}) {
    const r = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: t
      },
      e
    );
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
}
var y = Object.defineProperty, E = (s, t, e) => t in s ? y(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e, h = (s, t, e) => E(s, typeof t != "symbol" ? t + "" : t, e);
class I {
  constructor(t, e) {
    h(this, "http"), h(this, "pathname"), h(this, "schema"), this.http = d.getInstance(), this.pathname = t, this.schema = e;
  }
  validateData(t) {
    return t.map((e) => {
      const r = this.schema.safeParse(e);
      if (!r.success)
        throw console.error("Type validation failed:", r.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(r.error.errors)}`
        );
      return r.data;
    });
  }
  searchRequest(t, e = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/search`,
        data: { search: t }
      },
      e
    );
  }
  async search(t, e = {}) {
    const r = await this.searchRequest(t, e);
    return this.validateData(r.data);
  }
  async searchPaginate(t, e = {}) {
    const r = await this.searchRequest(t, e);
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
  getdetails(t = {}) {
    return this.http.request(
      {
        method: "GET",
        url: this.pathname
      },
      t
    );
  }
}
export {
  d as HttpClient,
  b as Mutation,
  I as Query
};

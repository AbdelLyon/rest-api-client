var l = Object.defineProperty;
var d = (r, t, e) => t in r ? l(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var a = (r, t, e) => d(r, typeof t != "symbol" ? t + "" : t, e);
import h from "axios-retry";
import p from "axios";
class c extends Error {
  constructor(t, e) {
    super("API Service Request Failed"), this.originalError = t, this.requestConfig = e, this.name = "ApiRequestError";
  }
}
const i = class i {
  constructor() {
    a(this, "axiosInstance");
    a(this, "maxRetries");
  }
  static init(t, e = "default") {
    if (!this.instances.has(e)) {
      const s = new i();
      s.maxRetries = t.maxRetries ?? 3, s.axiosInstance = s.createAxiosInstance(t), s.setupInterceptors(), s.configureRetry(), this.instances.set(e, s), this.instances.size === 1 && (this.defaultInstanceName = e);
    }
    return this.instances.get(e);
  }
  static getInstance(t) {
    const e = t || this.defaultInstanceName;
    if (!this.instances.has(e))
      throw new Error(
        `Http instance '${e}' not initialized. Call Http.init() first.`
      );
    return this.instances.get(e);
  }
  static setDefaultInstance(t) {
    if (!this.instances.has(t))
      throw new Error(
        `Cannot set default: Http instance '${t}' not initialized.`
      );
    this.defaultInstanceName = t;
  }
  static getAvailableInstances() {
    return Array.from(this.instances.keys());
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
      let s = t.apiPrefix.trim();
      return s.startsWith("/") || (s = "/" + s), s.endsWith("/") && (s = s.slice(0, -1)), e + s;
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
    return p.create(e);
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
    h(this.axiosInstance, {
      retries: this.maxRetries,
      retryDelay: h.exponentialDelay,
      retryCondition: this.isRetryableError.bind(this)
    });
  }
  isRetryableError(t) {
    var e;
    return h.isNetworkOrIdempotentRequestError(t) || ((e = t.response) == null ? void 0 : e.status) === 429;
  }
  handleErrorResponse(t) {
    return this.logError(t), Promise.reject(new c(t, t.config || {}));
  }
  logError(t) {
    var e, s, o, u;
    console.error("API Request Error", {
      url: (e = t.config) == null ? void 0 : e.url,
      method: (s = t.config) == null ? void 0 : s.method,
      status: (o = t.response) == null ? void 0 : o.status,
      data: (u = t.response) == null ? void 0 : u.data,
      message: t.message
    });
  }
  async request(t, e = {}) {
    try {
      const s = {
        timeout: 1e4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        ...t,
        ...e
      };
      return (await this.axiosInstance.request(
        s
      )).data;
    } catch (s) {
      throw s instanceof c ? s : new c(s, t);
    }
  }
  static resetInstance(t) {
    t ? (this.instances.delete(t), t === this.defaultInstanceName && this.instances.size > 0 && (this.defaultInstanceName = this.instances.keys().next().value ?? "default")) : (this.instances.clear(), this.defaultInstanceName = "default");
  }
};
a(i, "instances", /* @__PURE__ */ new Map()), a(i, "defaultInstanceName", "default");
let n = i;
class I {
  constructor(t, e) {
    a(this, "http");
    a(this, "pathname");
    a(this, "schema");
    this.http = n.getInstance(), this.pathname = t, this.schema = e;
  }
  validateData(t) {
    return t.map((e) => {
      const s = this.schema.safeParse(e);
      if (!s.success)
        throw console.error("Type validation failed:", s.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(s.error.errors)}`
        );
      return s.data;
    });
  }
  async mutate(t, e = {}) {
    const s = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: t
      },
      e
    );
    return {
      ...s,
      data: this.validateData(s.data)
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
    const s = await this.http.request(
      {
        method: "DELETE",
        url: this.pathname,
        data: t
      },
      e
    );
    return {
      ...s,
      data: this.validateData(s.data)
    };
  }
  async forceDelete(t, e = {}) {
    const s = await this.http.request(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: t
      },
      e
    );
    return {
      ...s,
      data: this.validateData(s.data)
    };
  }
  async restore(t, e = {}) {
    const s = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: t
      },
      e
    );
    return {
      ...s,
      data: this.validateData(s.data)
    };
  }
}
class g {
  constructor(t, e) {
    a(this, "http");
    a(this, "pathname");
    a(this, "schema");
    this.http = n.getInstance(), this.pathname = t, this.schema = e;
  }
  validateData(t) {
    return t.map((e) => {
      const s = this.schema.safeParse(e);
      if (!s.success)
        throw console.error("Type validation failed:", s.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(s.error.errors)}`
        );
      return s.data;
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
    const s = await this.searchRequest(t, e);
    return this.validateData(s.data);
  }
  async searchPaginate(t, e = {}) {
    const s = await this.searchRequest(t, e);
    return {
      ...s,
      data: this.validateData(s.data)
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
  n as HttpClient,
  I as Mutation,
  g as Query
};
//# sourceMappingURL=index.es.js.map

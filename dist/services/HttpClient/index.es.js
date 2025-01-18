import i from "axios-retry";
import l from "axios";
var p = Object.defineProperty, x = (r, e, t) => e in r ? p(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, o = (r, e, t) => x(r, typeof e != "symbol" ? e + "" : e, t);
class a extends Error {
  constructor(e, t) {
    super("API Service Request Failed"), this.originalError = e, this.requestConfig = t, this.name = "ApiRequestError";
  }
}
const u = class h {
  constructor() {
    o(this, "axiosInstance"), o(this, "maxRetries");
  }
  static init(e) {
    return this.instance || (this.instance = new h(), this.instance.maxRetries = e.maxRetries ?? 3, this.instance.axiosInstance = this.instance.createAxiosInstance(e), this.instance.setupInterceptors(), this.instance.configureRetry()), this.instance;
  }
  static getInstance() {
    if (!this.instance)
      throw new Error("Http not initialized. Call Http.init() first.");
    return this.instance;
  }
  getAxiosInstance() {
    return this.axiosInstance;
  }
  setAxiosInstance(e) {
    this.axiosInstance = e;
  }
  getFullBaseUrl(e) {
    return e.baseURL;
  }
  createAxiosInstance(e) {
    const t = {
      baseURL: this.getFullBaseUrl(e),
      timeout: e.timeout ?? 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...e.headers
      },
      withCredentials: e.withCredentials ?? !0
    };
    return l.create(t);
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
    i(this.axiosInstance, {
      retries: this.maxRetries,
      retryDelay: i.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(e) {
    var t;
    return i.isNetworkOrIdempotentRequestError(e) || ((t = e.response) == null ? void 0 : t.status) === 429;
  }
  handleErrorResponse(e) {
    return this.logError(e), Promise.reject(new a(e, e.config || {}));
  }
  logError(e) {
    var t, s, n, c;
    console.error("API Request Error", {
      url: (t = e.config) == null ? void 0 : t.url,
      method: (s = e.config) == null ? void 0 : s.method,
      status: (n = e.response) == null ? void 0 : n.status,
      data: (c = e.response) == null ? void 0 : c.data,
      message: e.message
    });
  }
  async request(e, t = {}) {
    try {
      const s = {
        timeout: 1e4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        ...e,
        ...t
      };
      return (await this.axiosInstance.request(
        s
      )).data;
    } catch (s) {
      throw s instanceof a ? s : new a(s, e);
    }
  }
  _setAxiosInstanceForTesting(e) {
    this.axiosInstance = e;
  }
};
o(u, "instance");
let I = u;
export {
  a as ApiRequestError,
  I as HttpClient
};

import a from "axios";
import n from "axios-retry";
import { getCookie as p, setCookie as o, deleteCookie as h } from "cookies-next";
var d = Object.defineProperty, l = (r, e, t) => e in r ? d(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, i = (r, e, t) => l(r, typeof e != "symbol" ? e + "" : e, t);
class f {
  constructor(e) {
    i(this, "axiosInstance"), i(this, "isRefreshing", !1), i(this, "refreshTokenPromise", null), i(this, "MAX_RETRIES", 3), this.axiosInstance = this.createInstance(e), this.initializeRetry(), this.setupInterceptors();
  }
  createInstance(e) {
    return a.create({
      baseURL: e,
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
      this.addAuthorizationHeader,
      (e) => Promise.reject(e)
    ), this.axiosInstance.interceptors.response.use(
      (e) => e,
      this.handleResponseError.bind(this)
    );
  }
  addAuthorizationHeader(e) {
    const t = p("jwt");
    return t && e.headers && (e.headers.Authorization = `Bearer ${t}`), e;
  }
  async handleResponseError(e) {
    const t = e.config;
    if (t._retry || !e.response)
      return Promise.reject(e);
    if (e.response.status === 401 && !this.isRefreshing) {
      t._retry = !0;
      try {
        return await this.handleTokenRefresh(), this.axiosInstance(t);
      } catch (s) {
        return this.handleAuthenticationFailure(), Promise.reject(s);
      }
    }
    return Promise.reject(e);
  }
  async handleTokenRefresh() {
    return this.refreshTokenPromise || (this.isRefreshing = !0, this.refreshTokenPromise = this.refreshToken().finally(() => {
      this.isRefreshing = !1, this.refreshTokenPromise = null;
    })), this.refreshTokenPromise;
  }
  async refreshToken() {
    var e, t;
    try {
      const s = await a.post(
        `${this.axiosInstance.defaults.baseURL}/refresh-token`,
        {},
        { withCredentials: !0 }
      );
      if (!((t = (e = s.data) == null ? void 0 : e.token) != null && t.access_token))
        throw new Error("Invalid token refresh response");
      this.updateTokens(s.data.token);
    } catch (s) {
      throw this.clearTokens(), s;
    }
  }
  updateTokens(e) {
    o("jwt", e.access_token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    }), e.refresh_token && o("refresh_token", e.refresh_token, {
      maxAge: 60 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: !0
    });
  }
  clearTokens() {
    h("jwt"), h("refresh_token");
  }
  handleAuthenticationFailure() {
    this.clearTokens(), typeof window < "u" && (window.location.href = "/");
  }
  initializeRetry() {
    n(this.axiosInstance, {
      retries: this.MAX_RETRIES,
      retryDelay: n.exponentialDelay,
      retryCondition: (e) => {
        var t;
        return n.isNetworkOrIdempotentRequestError(e) || ((t = e.response) == null ? void 0 : t.status) === 429;
      }
    });
  }
}
var m = Object.defineProperty, _ = (r, e, t) => e in r ? m(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, k = (r, e, t) => _(r, e + "", t);
const c = class u extends f {
  constructor(e) {
    super(e);
  }
  static getInstance(e) {
    return this.instances.has(e) || this.instances.set(e, new u(e)), this.instances.get(e);
  }
  async request(e) {
    try {
      return (await this.axiosInstance(e)).data;
    } catch (t) {
      throw console.error(
        `API Request failed: ${e.method} ${e.url}`,
        t
      ), t;
    }
  }
  async search(e) {
    return this.request({
      method: "POST",
      url: "/search",
      data: { search: e }
    });
  }
  async mutate(e) {
    return this.request({
      method: "POST",
      url: "/mutate",
      data: { mutate: e }
    });
  }
  async executeAction(e) {
    return this.request({
      method: "POST",
      url: `/actions/${e.action}`,
      data: e.params
    });
  }
};
k(c, "instances", /* @__PURE__ */ new Map());
let P = c;
export {
  P as ApiService,
  f as HttpService
};

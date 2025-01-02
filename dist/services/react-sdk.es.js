var c = Object.defineProperty;
var u = (i, e, t) => e in i ? c(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var r = (i, e, t) => u(i, typeof e != "symbol" ? e + "" : e, t);
import n from "axios";
import { getCookie as p, setCookie as o, deleteCookie as h } from "cookies-next";
import a from "axios-retry";
class k {
  constructor({
    pathname: e,
    baseDevUrl: t = "http://localhost:8000",
    baseProdUrl: s = "https://api.example.com"
  }) {
    r(this, "axiosInstance");
    r(this, "baseDevUrl");
    r(this, "baseProdUrl");
    r(this, "pathname");
    r(this, "isRefreshing", !1);
    r(this, "refreshTokenPromise", null);
    r(this, "MAX_RETRIES", 3);
    this.pathname = e, this.baseDevUrl = t, this.baseProdUrl = s, this.axiosInstance = this.createAxiosInstance(), this.initializeRetry(), this.setupInterceptors();
  }
  createAxiosInstance() {
    return n.create({
      baseURL: this.getBaseApiUrl(),
      timeout: 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      withCredentials: !0
    });
  }
  getBaseApiUrl() {
    return process.env.NODE_ENV === "production" ? `${this.baseProdUrl}/${this.pathname}` : `${this.baseDevUrl}/api/${this.pathname}`;
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (e) => this.addAuthorizationHeader(e),
      (e) => Promise.reject(e)
    ), this.axiosInstance.interceptors.response.use(
      (e) => e,
      async (e) => this.handleResponseError(e)
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
      const s = await n.post(
        `${this.getBaseApiUrl()}/refresh-token`,
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
    a(this.axiosInstance, {
      retries: this.MAX_RETRIES,
      retryDelay: a.exponentialDelay,
      retryCondition: (e) => {
        var t;
        return a.isNetworkOrIdempotentRequestError(e) || ((t = e.response) == null ? void 0 : t.status) === 429;
      }
    });
  }
  async request(e) {
    try {
      return (await this.axiosInstance(
        e
      )).data;
    } catch (t) {
      throw console.error(
        `API Request failed: ${e.method} ${e.url}`,
        t
      ), t;
    }
  }
  // rest-api Methods
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
  async executeAction(e, t) {
    return this.request({
      method: "POST",
      url: `/actions/${e}`,
      data: t
    });
  }
}
export {
  k as BaseService
};

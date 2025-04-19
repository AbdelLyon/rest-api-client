var n = Object.defineProperty;
var i = (a, t, e) => t in a ? n(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var s = (a, t, e) => i(a, typeof t != "symbol" ? t + "" : t, e);
import { HttpClient as c } from "../http/HttpClient.es.js";
class p {
  constructor(t, e) {
    s(this, "http");
    s(this, "pathname");
    s(this, "userSchema");
    s(this, "credentialsSchema");
    s(this, "registerDataSchema");
    s(this, "tokenSchema");
    this.http = c.getInstance(), this.pathname = t, this.userSchema = e.user, this.credentialsSchema = e.credentials, this.registerDataSchema = e.registerData, this.tokenSchema = e.tokens;
  }
  async register(t, e = {}) {
    this.registerDataSchema && this.registerDataSchema.parse(t);
    try {
      const r = await this.http.request({
        method: "POST",
        url: `${this.pathname}/register`,
        data: t
      }, e), h = this.userSchema.parse(r.user);
      return this.tokenSchema && this.tokenSchema.parse(r.tokens), h;
    } catch (r) {
      throw console.error("Registration error", r), r;
    }
  }
  async login(t, e = {}) {
    this.credentialsSchema && this.credentialsSchema.parse(t);
    try {
      const r = await this.http.request({
        method: "POST",
        url: `${this.pathname}/login`,
        data: t
      }, e), h = this.userSchema.parse(r.user), o = this.tokenSchema ? this.tokenSchema.parse(r.tokens) : r.tokens;
      return { user: h, tokens: o };
    } catch (r) {
      throw console.error("Login error", r), r;
    }
  }
  async logout(t = {}) {
    try {
      await this.http.request({
        method: "POST",
        url: `${this.pathname}/logout`
      }, t);
    } catch (e) {
      throw console.error("Logout error", e), e;
    }
  }
  async refreshToken(t, e = {}) {
    try {
      const r = await this.http.request({
        method: "POST",
        url: `${this.pathname}/refresh-token`,
        data: { refreshToken: t }
      }, e);
      return this.tokenSchema ? this.tokenSchema.parse(r) : r;
    } catch (r) {
      throw console.error("Token refresh error", r), r;
    }
  }
  async getCurrentUser(t = {}) {
    try {
      const e = await this.http.request({
        method: "GET",
        url: `${this.pathname}/me`
      }, t);
      return this.userSchema.parse(e);
    } catch (e) {
      throw console.error("Get current user error", e), e;
    }
  }
}
export {
  p as Auth
};
//# sourceMappingURL=Auth.es.js.map

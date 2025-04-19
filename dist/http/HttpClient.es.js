var E = Object.defineProperty;
var g = (u, e, t) => e in u ? E(u, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[e] = t;
var o = (u, e, t) => g(u, typeof e != "symbol" ? e + "" : e, t);
import { ApiRequestError as I } from "../error/ApiRequestError.es.js";
const i = class i {
  constructor() {
    o(this, "baseURL");
    o(this, "defaultTimeout");
    o(this, "defaultHeaders");
    o(this, "withCredentials");
    o(this, "maxRetries");
    this.baseURL = "", this.defaultTimeout = 1e4, this.defaultHeaders = {}, this.withCredentials = !0, this.maxRetries = 3;
  }
  static init(e) {
    var r, n;
    const { httpConfig: t, instanceName: s } = e;
    if (i.requestInterceptors = [
      ...i.requestInterceptors,
      ...((r = t.interceptors) == null ? void 0 : r.request) ?? []
    ], (n = t.interceptors) != null && n.response && (i.responseSuccessInterceptors = [
      ...i.responseSuccessInterceptors,
      ...t.interceptors.response.success ?? []
    ], i.responseErrorInterceptors = [
      ...i.responseErrorInterceptors,
      ...t.interceptors.response.error ?? []
    ]), !this.instances.has(s)) {
      const a = new i();
      a.configure(t), this.instances.set(s, a), this.instances.size === 1 && (this.defaultInstanceName = s);
    }
    return this.instances.get(s);
  }
  static getInstance(e) {
    const t = e || this.defaultInstanceName;
    if (!this.instances.has(t))
      throw new Error(
        `Http instance '${t}' not initialized. Call Http.init() first.`
      );
    return this.instances.get(t);
  }
  static setDefaultInstance(e) {
    if (!this.instances.has(e))
      throw new Error(
        `Cannot set default: Http instance '${e}' not initialized.`
      );
    this.defaultInstanceName = e;
  }
  static getAvailableInstances() {
    return Array.from(this.instances.keys());
  }
  static resetInstance(e) {
    e ? (this.instances.delete(e), e === this.defaultInstanceName && this.instances.size > 0 && (this.defaultInstanceName = this.instances.keys().next().value ?? "default")) : (this.instances.clear(), this.defaultInstanceName = "default");
  }
  configure(e) {
    this.baseURL = this.getFullBaseUrl(e), this.defaultTimeout = e.timeout ?? 1e4, this.maxRetries = e.maxRetries ?? 3, this.withCredentials = e.withCredentials ?? !0, this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...e.headers
    }, this.setupDefaultInterceptors();
  }
  getFullBaseUrl(e) {
    if (!e.baseURL)
      throw new Error("baseURL is required in HttpConfigOptions");
    let t = e.baseURL.trim();
    if (t.endsWith("/") && (t = t.slice(0, -1)), e.apiPrefix) {
      let s = e.apiPrefix.trim();
      return s.startsWith("/") || (s = "/" + s), s.endsWith("/") && (s = s.slice(0, -1)), t + s;
    }
    return e.apiVersion ? `${t}/v${e.apiVersion}` : t;
  }
  setupDefaultInterceptors() {
    i.responseErrorInterceptors.length === 0 && i.responseErrorInterceptors.push((e) => (this.logError(e), Promise.reject(e)));
  }
  logError(e) {
    var s, r;
    const t = {
      url: (s = e.config) == null ? void 0 : s.url,
      method: (r = e.config) == null ? void 0 : r.method,
      status: e.status,
      data: e.data,
      message: e.message
    };
    console.error("API Request Error", t);
  }
  async applyRequestInterceptors(e) {
    let t = { ...e };
    for (const s of i.requestInterceptors)
      t = await Promise.resolve(s(t));
    return t;
  }
  async applyResponseSuccessInterceptors(e) {
    let t = e;
    for (const s of i.responseSuccessInterceptors)
      t = await Promise.resolve(s(t.clone()));
    return t;
  }
  async applyResponseErrorInterceptors(e) {
    let t = e;
    for (const s of i.responseErrorInterceptors)
      try {
        if (t = await Promise.resolve(s(t)), !(t instanceof Error))
          return t;
      } catch (r) {
        t = r;
      }
    return Promise.reject(t);
  }
  isRetryableError(e, t) {
    return (!t || ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"].includes(t.toUpperCase())) && (e === 0 || e === 429 || e >= 500 && e < 600);
  }
  async fetchWithRetry(e, t, s = 1) {
    try {
      const { timeout: r = this.defaultTimeout, params: n, data: a, ...c } = t;
      let f = e;
      if (n && Object.keys(n).length > 0) {
        const h = new URLSearchParams();
        for (const [p, R] of Object.entries(n))
          h.append(p, R);
        f += `?${h.toString()}`;
      }
      const d = new AbortController(), y = setTimeout(() => d.abort("Request timeout"), r);
      let m;
      a !== void 0 && (m = typeof a == "string" ? a : JSON.stringify(a));
      const l = await fetch(f, {
        ...c,
        body: m,
        signal: d.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(y), !l.ok && s < this.maxRetries && this.isRetryableError(l.status, t.method)) {
        const h = Math.pow(2, s) * 100;
        return await new Promise((p) => setTimeout(p, h)), this.fetchWithRetry(e, t, s + 1);
      }
      return l;
    } catch (r) {
      if (r instanceof DOMException && r.name === "AbortError")
        throw new Error(`Request timeout after ${t.timeout || this.defaultTimeout}ms`);
      if (s < this.maxRetries && this.isRetryableError(0, t.method)) {
        const n = Math.pow(2, s) * 100;
        return await new Promise((a) => setTimeout(a, n)), this.fetchWithRetry(e, t, s + 1);
      }
      throw r;
    }
  }
  async request(e, t = {}) {
    var s;
    try {
      const r = {
        method: "GET",
        timeout: this.defaultTimeout,
        ...e,
        ...t,
        headers: {
          ...this.defaultHeaders,
          ...e.headers || {},
          ...t.headers || {}
        }
      }, n = new URL(
        r.url.startsWith("http") ? r.url : `${this.baseURL}${r.url.startsWith("/") ? "" : "/"}${r.url}`
      ).toString(), a = await this.applyRequestInterceptors({
        ...r,
        url: n
      });
      let c = await this.fetchWithRetry(n, a);
      return c = await this.applyResponseSuccessInterceptors(c), (s = c.headers.get("content-type")) != null && s.includes("application/json") ? await c.json() : await c.text();
    } catch (r) {
      const n = r instanceof I ? r : new I(r, {
        ...e,
        ...t,
        url: e.url
      });
      return this.applyResponseErrorInterceptors(n);
    }
  }
};
o(i, "instances", /* @__PURE__ */ new Map()), o(i, "defaultInstanceName"), o(i, "requestInterceptors", []), o(i, "responseSuccessInterceptors", []), o(i, "responseErrorInterceptors", []);
let w = i;
export {
  w as HttpClient
};

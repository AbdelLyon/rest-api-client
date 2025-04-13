var R = Object.defineProperty;
var g = (c, t, e) => t in c ? R(c, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : c[t] = e;
var a = (c, t, e) => g(c, typeof t != "symbol" ? t + "" : t, e);
class l extends Error {
  constructor(e, s) {
    const r = e instanceof Error ? e.message : "API Service Request Failed";
    super(r);
    a(this, "status");
    a(this, "statusText");
    a(this, "data");
    a(this, "originalError");
    a(this, "requestConfig");
    if (this.name = "ApiRequestError", this.originalError = e, this.requestConfig = s, e && typeof e == "object") {
      const i = e;
      if ("status" in i && (this.status = i.status), "statusText" in i && (this.statusText = i.statusText), "data" in i && (this.data = i.data), "response" in i && i.response instanceof Response) {
        const o = i.response;
        this.status = o.status, this.statusText = o.statusText;
      }
    }
    Error.captureStackTrace && Error.captureStackTrace(this, l);
  }
  // Méthodes utilitaires pour vérifier le type d'erreur
  isNotFound() {
    return this.status === 404;
  }
  isUnauthorized() {
    return this.status === 401;
  }
  isForbidden() {
    return this.status === 403;
  }
  isServerError() {
    return this.status !== void 0 && this.status >= 500 && this.status < 600;
  }
  isNetworkError() {
    return this.status === void 0 || this.status === 0;
  }
}
const n = class n {
  constructor() {
    a(this, "baseURL");
    a(this, "defaultTimeout");
    a(this, "defaultHeaders");
    a(this, "withCredentials");
    a(this, "maxRetries");
    this.baseURL = "", this.defaultTimeout = 1e4, this.defaultHeaders = {}, this.withCredentials = !0, this.maxRetries = 3;
  }
  /**
   * Initialise une nouvelle instance HTTP avec intercepteurs
   */
  static init(t, e = "default") {
    if (t.interceptors && (t.interceptors.request && t.interceptors.request.length > 0 && (n.requestInterceptors = [
      ...n.requestInterceptors,
      ...t.interceptors.request
    ]), t.interceptors.response && (t.interceptors.response.success && t.interceptors.response.success.length > 0 && (n.responseSuccessInterceptors = [
      ...n.responseSuccessInterceptors,
      ...t.interceptors.response.success
    ]), t.interceptors.response.error && t.interceptors.response.error.length > 0 && (n.responseErrorInterceptors = [
      ...n.responseErrorInterceptors,
      ...t.interceptors.response.error
    ]))), !this.instances.has(e)) {
      const s = new n();
      s.configure(t), this.instances.set(e, s), this.instances.size === 1 && (this.defaultInstanceName = e);
    }
    return this.instances.get(e);
  }
  /**
   * Récupère une instance existante
   */
  static getInstance(t) {
    const e = t || this.defaultInstanceName;
    if (!this.instances.has(e))
      throw new Error(
        `Http instance '${e}' not initialized. Call Http.init() first.`
      );
    return this.instances.get(e);
  }
  /**
   * Définit l'instance par défaut
   */
  static setDefaultInstance(t) {
    if (!this.instances.has(t))
      throw new Error(
        `Cannot set default: Http instance '${t}' not initialized.`
      );
    this.defaultInstanceName = t;
  }
  /**
   * Récupère la liste des instances disponibles
   */
  static getAvailableInstances() {
    return Array.from(this.instances.keys());
  }
  /**
   * Réinitialise une instance ou toutes les instances
   */
  static resetInstance(t) {
    t ? (this.instances.delete(t), t === this.defaultInstanceName && this.instances.size > 0 && (this.defaultInstanceName = this.instances.keys().next().value ?? "default")) : (this.instances.clear(), this.defaultInstanceName = "default");
  }
  /**
   * Configure l'instance HTTP
   */
  configure(t) {
    this.baseURL = this.getFullBaseUrl(t), this.defaultTimeout = t.timeout ?? 1e4, this.maxRetries = t.maxRetries ?? 3, this.withCredentials = t.withCredentials ?? !0, this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...t.headers
    }, this.setupDefaultInterceptors();
  }
  /**
   * Construit l'URL de base complète
   */
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
  /**
   * Configure les intercepteurs par défaut
   */
  setupDefaultInterceptors() {
    n.responseErrorInterceptors.length === 0 && n.responseErrorInterceptors.push((t) => (this.logError(t), Promise.reject(t)));
  }
  /**
   * Journalise les erreurs de requête
   */
  logError(t) {
    var s, r;
    const e = {
      url: (s = t.config) == null ? void 0 : s.url,
      method: (r = t.config) == null ? void 0 : r.method,
      status: t.status,
      data: t.data,
      message: t.message
    };
    console.error("API Request Error", e);
  }
  /**
   * Applique les intercepteurs de requête
   */
  async applyRequestInterceptors(t) {
    let e = { ...t };
    for (const s of n.requestInterceptors)
      e = await Promise.resolve(s(e));
    return e;
  }
  /**
   * Applique les intercepteurs de réponse réussie
   */
  async applyResponseSuccessInterceptors(t) {
    let e = t;
    for (const s of n.responseSuccessInterceptors)
      e = await Promise.resolve(s(e.clone()));
    return e;
  }
  /**
   * Applique les intercepteurs d'erreur de réponse
   */
  async applyResponseErrorInterceptors(t) {
    let e = t;
    for (const s of n.responseErrorInterceptors)
      try {
        if (e = await Promise.resolve(s(e)), !(e instanceof Error))
          return e;
      } catch (r) {
        e = r;
      }
    return Promise.reject(e);
  }
  /**
   * Détermine si une erreur est susceptible d'être réessayée
   */
  isRetryableError(t, e) {
    return (!e || ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"].includes(e.toUpperCase())) && (t === 0 || // Erreur réseau
    t === 429 || // Trop de requêtes
    t >= 500 && t < 600);
  }
  /**
   * Effectue une requête avec gestion des tentatives
   */
  async fetchWithRetry(t, e, s = 1) {
    try {
      const { timeout: r = this.defaultTimeout, params: i, data: o, ...h } = e;
      let m = t;
      if (i && Object.keys(i).length > 0) {
        const u = new URLSearchParams();
        for (const [f, I] of Object.entries(i))
          u.append(f, I);
        m += `?${u.toString()}`;
      }
      const y = new AbortController(), w = setTimeout(() => y.abort("Request timeout"), r);
      let E;
      o !== void 0 && (E = typeof o == "string" ? o : JSON.stringify(o));
      const p = await fetch(m, {
        ...h,
        body: E,
        signal: y.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(w), !p.ok && s < this.maxRetries && this.isRetryableError(p.status, e.method)) {
        const u = Math.pow(2, s) * 100;
        return await new Promise((f) => setTimeout(f, u)), this.fetchWithRetry(t, e, s + 1);
      }
      return p;
    } catch (r) {
      if (r instanceof DOMException && r.name === "AbortError")
        throw new Error(`Request timeout after ${e.timeout || this.defaultTimeout}ms`);
      if (s < this.maxRetries && this.isRetryableError(0, e.method)) {
        const i = Math.pow(2, s) * 100;
        return await new Promise((o) => setTimeout(o, i)), this.fetchWithRetry(t, e, s + 1);
      }
      throw r;
    }
  }
  /**
   * Méthode principale pour effectuer une requête
   */
  async request(t, e = {}) {
    var s;
    try {
      const r = {
        method: "GET",
        timeout: this.defaultTimeout,
        ...t,
        ...e,
        headers: {
          ...this.defaultHeaders,
          ...t.headers || {},
          ...e.headers || {}
        }
      }, i = new URL(
        r.url.startsWith("http") ? r.url : `${this.baseURL}${r.url.startsWith("/") ? "" : "/"}${r.url}`
      ).toString(), o = await this.applyRequestInterceptors({
        ...r,
        url: i
      });
      let h = await this.fetchWithRetry(i, o);
      return h = await this.applyResponseSuccessInterceptors(h), (s = h.headers.get("content-type")) != null && s.includes("application/json") ? await h.json() : await h.text();
    } catch (r) {
      const i = r instanceof l ? r : new l(r, {
        ...t,
        ...e,
        url: t.url
      });
      return this.applyResponseErrorInterceptors(i);
    }
  }
};
a(n, "instances", /* @__PURE__ */ new Map()), a(n, "defaultInstanceName", "default"), // Intercepteurs statiques
a(n, "requestInterceptors", []), a(n, "responseSuccessInterceptors", []), a(n, "responseErrorInterceptors", []);
let d = n;
class q {
  constructor(t, e) {
    a(this, "http");
    a(this, "pathname");
    a(this, "schema");
    this.http = d.getInstance(), this.pathname = t, this.schema = e;
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
class v {
  constructor(t, e) {
    a(this, "http");
    a(this, "pathname");
    a(this, "schema");
    this.http = d.getInstance(), this.pathname = t, this.schema = e;
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
  d as HttpClient,
  q as Mutation,
  v as Query
};
//# sourceMappingURL=index.es.js.map

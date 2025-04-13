var R = Object.defineProperty;
var g = (o, e, t) => e in o ? R(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var a = (o, e, t) => g(o, typeof e != "symbol" ? e + "" : e, t);
class w extends Error {
  constructor(t, s) {
    const r = t instanceof Error ? t.message : String(t);
    super(r);
    a(this, "status");
    a(this, "data");
    a(this, "config");
    this.name = "ApiRequestError", this.config = s, t && typeof t == "object" && "status" in t && (this.status = t.status), t && typeof t == "object" && "data" in t && (this.data = t.data);
  }
}
const i = class i {
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
  static init(e, t = "default") {
    if (e.interceptors && (e.interceptors.request && e.interceptors.request.length > 0 && (i.requestInterceptors = [
      ...i.requestInterceptors,
      ...e.interceptors.request
    ]), e.interceptors.response && (e.interceptors.response.success && e.interceptors.response.success.length > 0 && (i.responseSuccessInterceptors = [
      ...i.responseSuccessInterceptors,
      ...e.interceptors.response.success
    ]), e.interceptors.response.error && e.interceptors.response.error.length > 0 && (i.responseErrorInterceptors = [
      ...i.responseErrorInterceptors,
      ...e.interceptors.response.error
    ]))), !this.instances.has(t)) {
      const s = new i();
      s.configure(e), this.instances.set(t, s), this.instances.size === 1 && (this.defaultInstanceName = t);
    }
    return this.instances.get(t);
  }
  /**
   * Récupère une instance existante
   */
  static getInstance(e) {
    const t = e || this.defaultInstanceName;
    if (!this.instances.has(t))
      throw new Error(
        `Http instance '${t}' not initialized. Call Http.init() first.`
      );
    return this.instances.get(t);
  }
  /**
   * Définit l'instance par défaut
   */
  static setDefaultInstance(e) {
    if (!this.instances.has(e))
      throw new Error(
        `Cannot set default: Http instance '${e}' not initialized.`
      );
    this.defaultInstanceName = e;
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
  static resetInstance(e) {
    e ? (this.instances.delete(e), e === this.defaultInstanceName && this.instances.size > 0 && (this.defaultInstanceName = this.instances.keys().next().value ?? "default")) : (this.instances.clear(), this.defaultInstanceName = "default");
  }
  /**
   * Configure l'instance HTTP
   */
  configure(e) {
    this.baseURL = this.getFullBaseUrl(e), this.defaultTimeout = e.timeout ?? 1e4, this.maxRetries = e.maxRetries ?? 3, this.withCredentials = e.withCredentials ?? !0, this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...e.headers
    }, this.setupDefaultInterceptors();
  }
  /**
   * Construit l'URL de base complète
   */
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
  /**
   * Configure les intercepteurs par défaut
   */
  setupDefaultInterceptors() {
    i.responseErrorInterceptors.length === 0 && i.responseErrorInterceptors.push((e) => (this.logError(e), Promise.reject(e)));
  }
  /**
   * Journalise les erreurs de requête
   */
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
  /**
   * Applique les intercepteurs de requête
   */
  async applyRequestInterceptors(e) {
    let t = { ...e };
    for (const s of i.requestInterceptors)
      t = await Promise.resolve(s(t));
    return t;
  }
  /**
   * Applique les intercepteurs de réponse réussie
   */
  async applyResponseSuccessInterceptors(e) {
    let t = e;
    for (const s of i.responseSuccessInterceptors)
      t = await Promise.resolve(s(t.clone()));
    return t;
  }
  /**
   * Applique les intercepteurs d'erreur de réponse
   */
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
  /**
   * Détermine si une erreur est susceptible d'être réessayée
   */
  isRetryableError(e, t) {
    return (!t || ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"].includes(t.toUpperCase())) && (e === 0 || // Erreur réseau
    e === 429 || // Trop de requêtes
    e >= 500 && e < 600);
  }
  /**
   * Effectue une requête avec gestion des tentatives
   */
  async fetchWithRetry(e, t, s = 1) {
    try {
      const { timeout: r = this.defaultTimeout, params: n, data: c, ...h } = t;
      let f = e;
      if (n && Object.keys(n).length > 0) {
        const u = new URLSearchParams();
        for (const [d, I] of Object.entries(n))
          u.append(d, I);
        f += `?${u.toString()}`;
      }
      const m = new AbortController(), E = setTimeout(() => m.abort("Request timeout"), r);
      let y;
      c !== void 0 && (y = typeof c == "string" ? c : JSON.stringify(c));
      const p = await fetch(f, {
        ...h,
        body: y,
        signal: m.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(E), !p.ok && s < this.maxRetries && this.isRetryableError(p.status, t.method)) {
        const u = Math.pow(2, s) * 100;
        return await new Promise((d) => setTimeout(d, u)), this.fetchWithRetry(e, t, s + 1);
      }
      return p;
    } catch (r) {
      if (r instanceof DOMException && r.name === "AbortError")
        throw new Error(`Request timeout after ${t.timeout || this.defaultTimeout}ms`);
      if (s < this.maxRetries && this.isRetryableError(0, t.method)) {
        const n = Math.pow(2, s) * 100;
        return await new Promise((c) => setTimeout(c, n)), this.fetchWithRetry(e, t, s + 1);
      }
      throw r;
    }
  }
  /**
   * Méthode principale pour effectuer une requête
   */
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
      ).toString(), c = await this.applyRequestInterceptors({
        ...r,
        url: n
      });
      let h = await this.fetchWithRetry(n, c);
      return h = await this.applyResponseSuccessInterceptors(h), (s = h.headers.get("content-type")) != null && s.includes("application/json") ? await h.json() : await h.text();
    } catch (r) {
      const n = r instanceof w ? r : new w(r, {
        ...e,
        ...t,
        url: e.url
      });
      return this.applyResponseErrorInterceptors(n);
    }
  }
};
a(i, "instances", /* @__PURE__ */ new Map()), a(i, "defaultInstanceName", "default"), // Intercepteurs statiques
a(i, "requestInterceptors", []), a(i, "responseSuccessInterceptors", []), a(i, "responseErrorInterceptors", []);
let l = i;
class q {
  constructor(e, t) {
    a(this, "http");
    a(this, "pathname");
    a(this, "schema");
    this.http = l.getInstance(), this.pathname = e, this.schema = t;
  }
  validateData(e) {
    return e.map((t) => {
      const s = this.schema.safeParse(t);
      if (!s.success)
        throw console.error("Type validation failed:", s.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(s.error.errors)}`
        );
      return s.data;
    });
  }
  async mutate(e, t = {}) {
    const s = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: e
      },
      t
    );
    return {
      ...s,
      data: this.validateData(s.data)
    };
  }
  executeAction(e, t = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/actions/${e.action}`,
        data: e.payload
      },
      t
    );
  }
  async delete(e, t = {}) {
    const s = await this.http.request(
      {
        method: "DELETE",
        url: this.pathname,
        data: e
      },
      t
    );
    return {
      ...s,
      data: this.validateData(s.data)
    };
  }
  async forceDelete(e, t = {}) {
    const s = await this.http.request(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: e
      },
      t
    );
    return {
      ...s,
      data: this.validateData(s.data)
    };
  }
  async restore(e, t = {}) {
    const s = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: e
      },
      t
    );
    return {
      ...s,
      data: this.validateData(s.data)
    };
  }
}
class v {
  constructor(e, t) {
    a(this, "http");
    a(this, "pathname");
    a(this, "schema");
    this.http = l.getInstance(), this.pathname = e, this.schema = t;
  }
  validateData(e) {
    return e.map((t) => {
      const s = this.schema.safeParse(t);
      if (!s.success)
        throw console.error("Type validation failed:", s.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(s.error.errors)}`
        );
      return s.data;
    });
  }
  searchRequest(e, t = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/search`,
        data: { search: e }
      },
      t
    );
  }
  async search(e, t = {}) {
    const s = await this.searchRequest(e, t);
    return this.validateData(s.data);
  }
  async searchPaginate(e, t = {}) {
    const s = await this.searchRequest(e, t);
    return {
      ...s,
      data: this.validateData(s.data)
    };
  }
  getdetails(e = {}) {
    return this.http.request(
      {
        method: "GET",
        url: this.pathname
      },
      e
    );
  }
}
export {
  l as HttpClient,
  q as Mutation,
  v as Query
};
//# sourceMappingURL=index.es.js.map

var R = Object.defineProperty;
var g = (o, t, e) => t in o ? R(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var i = (o, t, e) => g(o, typeof t != "symbol" ? t + "" : t, e);
class I extends Error {
  constructor(e, s) {
    const a = e instanceof Error ? e.message : String(e);
    super(a);
    i(this, "status");
    i(this, "data");
    i(this, "config");
    this.name = "ApiRequestError", this.config = s, e && typeof e == "object" && "status" in e && (this.status = e.status), e && typeof e == "object" && "data" in e && (this.data = e.data);
  }
}
const r = class r {
  constructor() {
    i(this, "baseURL");
    i(this, "defaultTimeout");
    i(this, "defaultHeaders");
    i(this, "withCredentials");
    i(this, "maxRetries");
    this.baseURL = "", this.defaultTimeout = 1e4, this.defaultHeaders = {}, this.withCredentials = !0, this.maxRetries = 3;
  }
  /**
   * Initialise une nouvelle instance HTTP ou renvoie une instance existante
   */
  static init(t, e = "default") {
    if (!this.instances.has(e)) {
      const s = new r();
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
    r.responseErrorInterceptors.length === 0 && r.interceptors.response.use(
      (t) => t,
      (t) => (this.logError(t), Promise.reject(t))
    );
  }
  /**
   * Journalise les erreurs de requête
   */
  logError(t) {
    var s, a;
    const e = {
      url: (s = t.config) == null ? void 0 : s.url,
      method: (a = t.config) == null ? void 0 : a.method,
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
    for (const s of r.requestInterceptors)
      e = await Promise.resolve(s(e));
    return e;
  }
  /**
   * Applique les intercepteurs de réponse réussie
   */
  async applyResponseSuccessInterceptors(t) {
    let e = t;
    for (const s of r.responseSuccessInterceptors)
      e = await Promise.resolve(s(e.clone()));
    return e;
  }
  /**
   * Applique les intercepteurs d'erreur de réponse
   */
  async applyResponseErrorInterceptors(t) {
    let e = t;
    for (const s of r.responseErrorInterceptors)
      try {
        if (e = await Promise.resolve(s(e)), !(e instanceof Error))
          return e;
      } catch (a) {
        e = a;
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
      const { timeout: a = this.defaultTimeout, params: n, data: c, ...h } = e;
      let f = t;
      if (n && Object.keys(n).length > 0) {
        const u = new URLSearchParams();
        for (const [d, E] of Object.entries(n))
          u.append(d, E);
        f += `?${u.toString()}`;
      }
      const m = new AbortController(), w = setTimeout(() => m.abort("Request timeout"), a);
      let y;
      c !== void 0 && (y = typeof c == "string" ? c : JSON.stringify(c));
      const p = await fetch(f, {
        ...h,
        body: y,
        signal: m.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(w), !p.ok && s < this.maxRetries && this.isRetryableError(p.status, e.method)) {
        const u = Math.pow(2, s) * 100;
        return await new Promise((d) => setTimeout(d, u)), this.fetchWithRetry(t, e, s + 1);
      }
      return p;
    } catch (a) {
      if (a instanceof DOMException && a.name === "AbortError")
        throw new Error(`Request timeout after ${e.timeout || this.defaultTimeout}ms`);
      if (s < this.maxRetries && this.isRetryableError(0, e.method)) {
        const n = Math.pow(2, s) * 100;
        return await new Promise((c) => setTimeout(c, n)), this.fetchWithRetry(t, e, s + 1);
      }
      throw a;
    }
  }
  /**
   * Méthode principale pour effectuer une requête
   */
  async request(t, e = {}) {
    var s;
    try {
      const a = {
        method: "GET",
        timeout: this.defaultTimeout,
        ...t,
        ...e,
        headers: {
          ...this.defaultHeaders,
          ...t.headers || {},
          ...e.headers || {}
        }
      }, n = new URL(
        a.url.startsWith("http") ? a.url : `${this.baseURL}${a.url.startsWith("/") ? "" : "/"}${a.url}`
      ).toString(), c = await this.applyRequestInterceptors({
        ...a,
        url: n
      });
      let h = await this.fetchWithRetry(n, c);
      return h = await this.applyResponseSuccessInterceptors(h), (s = h.headers.get("content-type")) != null && s.includes("application/json") ? await h.json() : await h.text();
    } catch (a) {
      const n = a instanceof I ? a : new I(a, {
        ...t,
        ...e,
        url: t.url
      });
      return this.applyResponseErrorInterceptors(n);
    }
  }
};
i(r, "instances", /* @__PURE__ */ new Map()), i(r, "defaultInstanceName", "default"), // Intercepteurs statiques uniquement
i(r, "requestInterceptors", []), i(r, "responseSuccessInterceptors", []), i(r, "responseErrorInterceptors", []), /**
 * Interface statique pour gérer les intercepteurs
 */
i(r, "interceptors", {
  request: {
    use: (t) => r.requestInterceptors.push(t) - 1,
    eject: (t) => {
      t >= 0 && t < r.requestInterceptors.length && r.requestInterceptors.splice(t, 1);
    },
    clear: () => {
      r.requestInterceptors = [];
    }
  },
  response: {
    use: (t, e) => {
      const s = r.responseSuccessInterceptors.push(t) - 1;
      return e && r.responseErrorInterceptors.push(e), s;
    },
    eject: (t) => {
      t >= 0 && t < r.responseSuccessInterceptors.length && (r.responseSuccessInterceptors.splice(t, 1), t < r.responseErrorInterceptors.length && r.responseErrorInterceptors.splice(t, 1));
    },
    clear: () => {
      r.responseSuccessInterceptors = [], r.responseErrorInterceptors = [];
    }
  }
});
let l = r;
class q {
  constructor(t, e) {
    i(this, "http");
    i(this, "pathname");
    i(this, "schema");
    this.http = l.getInstance(), this.pathname = t, this.schema = e;
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
    i(this, "http");
    i(this, "pathname");
    i(this, "schema");
    this.http = l.getInstance(), this.pathname = t, this.schema = e;
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
  l as HttpClient,
  q as Mutation,
  v as Query
};
//# sourceMappingURL=index.es.js.map

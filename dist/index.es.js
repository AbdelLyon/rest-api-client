var R = Object.defineProperty;
var T = (h, t, e) => t in h ? R(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var n = (h, t, e) => T(h, typeof t != "symbol" ? t + "" : t, e);
class d extends Error {
  constructor(e, s) {
    const r = e instanceof Error ? e.message : "API Service Request Failed";
    super(r);
    n(this, "status");
    n(this, "statusText");
    n(this, "data");
    n(this, "originalError");
    n(this, "requestConfig");
    if (this.name = "ApiRequestError", this.originalError = e, this.requestConfig = s, e && typeof e == "object") {
      const a = e;
      if ("status" in a && (this.status = a.status), "statusText" in a && (this.statusText = a.statusText), "data" in a && (this.data = a.data), "response" in a && a.response instanceof Response) {
        const i = a.response;
        this.status = i.status, this.statusText = i.statusText;
      }
    }
    Error.captureStackTrace && Error.captureStackTrace(this, d);
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
const o = class o {
  constructor() {
    n(this, "baseURL");
    n(this, "defaultTimeout");
    n(this, "defaultHeaders");
    n(this, "withCredentials");
    n(this, "maxRetries");
    this.baseURL = "", this.defaultTimeout = 1e4, this.defaultHeaders = {}, this.withCredentials = !0, this.maxRetries = 3;
  }
  /**
   * Initialise une nouvelle instance HTTP avec intercepteurs
   */
  static init(t) {
    var r, a;
    const { httpConfig: e, instanceName: s } = t;
    if (o.requestInterceptors = [
      ...o.requestInterceptors,
      ...((r = e.interceptors) == null ? void 0 : r.request) ?? []
    ], (a = e.interceptors) != null && a.response && (o.responseSuccessInterceptors = [
      ...o.responseSuccessInterceptors,
      ...e.interceptors.response.success ?? []
    ], o.responseErrorInterceptors = [
      ...o.responseErrorInterceptors,
      ...e.interceptors.response.error ?? []
    ]), !this.instances.has(s)) {
      const i = new o();
      i.configure(e), this.instances.set(s, i), this.instances.size === 1 && (this.defaultInstanceName = s);
    }
    return this.instances.get(s);
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
    o.responseErrorInterceptors.length === 0 && o.responseErrorInterceptors.push((t) => (this.logError(t), Promise.reject(t)));
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
    for (const s of o.requestInterceptors)
      e = await Promise.resolve(s(e));
    return e;
  }
  /**
   * Applique les intercepteurs de réponse réussie
   */
  async applyResponseSuccessInterceptors(t) {
    let e = t;
    for (const s of o.responseSuccessInterceptors)
      e = await Promise.resolve(s(e.clone()));
    return e;
  }
  /**
   * Applique les intercepteurs d'erreur de réponse
   */
  async applyResponseErrorInterceptors(t) {
    let e = t;
    for (const s of o.responseErrorInterceptors)
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
      const { timeout: r = this.defaultTimeout, params: a, data: i, ...c } = e;
      let g = t;
      if (a && Object.keys(a).length > 0) {
        const p = new URLSearchParams();
        for (const [m, I] of Object.entries(a))
          p.append(m, I);
        g += `?${p.toString()}`;
      }
      const w = new AbortController(), S = setTimeout(() => w.abort("Request timeout"), r);
      let E;
      i !== void 0 && (E = typeof i == "string" ? i : JSON.stringify(i));
      const f = await fetch(g, {
        ...c,
        body: E,
        signal: w.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(S), !f.ok && s < this.maxRetries && this.isRetryableError(f.status, e.method)) {
        const p = Math.pow(2, s) * 100;
        return await new Promise((m) => setTimeout(m, p)), this.fetchWithRetry(t, e, s + 1);
      }
      return f;
    } catch (r) {
      if (r instanceof DOMException && r.name === "AbortError")
        throw new Error(`Request timeout after ${e.timeout || this.defaultTimeout}ms`);
      if (s < this.maxRetries && this.isRetryableError(0, e.method)) {
        const a = Math.pow(2, s) * 100;
        return await new Promise((i) => setTimeout(i, a)), this.fetchWithRetry(t, e, s + 1);
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
      }, a = new URL(
        r.url.startsWith("http") ? r.url : `${this.baseURL}${r.url.startsWith("/") ? "" : "/"}${r.url}`
      ).toString(), i = await this.applyRequestInterceptors({
        ...r,
        url: a
      });
      let c = await this.fetchWithRetry(a, i);
      return c = await this.applyResponseSuccessInterceptors(c), (s = c.headers.get("content-type")) != null && s.includes("application/json") ? await c.json() : await c.text();
    } catch (r) {
      const a = r instanceof d ? r : new d(r, {
        ...t,
        ...e,
        url: t.url
      });
      return this.applyResponseErrorInterceptors(a);
    }
  }
};
n(o, "instances", /* @__PURE__ */ new Map()), n(o, "defaultInstanceName"), // Intercepteurs statiques
n(o, "requestInterceptors", []), n(o, "responseSuccessInterceptors", []), n(o, "responseErrorInterceptors", []);
let l = o;
const u = class u {
  constructor() {
    n(this, "mutate", []);
  }
  static createBuilder() {
    return u.instance || (u.instance = new u()), u.instance;
  }
  createEntity(t) {
    const e = {}, s = {};
    for (const [a, i] of Object.entries(t))
      i && typeof i == "object" && "operation" in i ? s[a] = i : e[a] = i;
    const r = {
      operation: "create",
      attributes: e,
      ...Object.keys(s).length > 0 && { relations: s }
    };
    return this.mutate.push(r), this;
  }
  updateEntity(t, e) {
    const s = {}, r = {};
    for (const [i, c] of Object.entries(e))
      c && typeof c == "object" && "operation" in c ? r[i] = c : s[i] = c;
    const a = {
      operation: "update",
      key: t,
      attributes: s,
      ...Object.keys(r).length > 0 && { relations: r }
    };
    return this.mutate.push(a), this;
  }
  createRelation(t) {
    const e = {}, s = {};
    if (t && typeof t == "object")
      for (const [r, a] of Object.entries(t))
        a && typeof a == "object" && "operation" in a ? s[r] = a : e[r] = a;
    return {
      operation: "create",
      attributes: e,
      ...Object.keys(s).length > 0 && { relations: s }
    };
  }
  updateRelation(t, e) {
    const s = {}, r = {};
    if (e && typeof e == "object")
      for (const [a, i] of Object.entries(e))
        i && typeof i == "object" && "operation" in i ? r[a] = i : s[a] = i;
    return {
      operation: "update",
      key: t,
      attributes: s,
      ...Object.keys(r).length > 0 && { relations: r }
    };
  }
  attach(t) {
    return {
      operation: "attach",
      key: t
    };
  }
  detach(t) {
    return {
      operation: "detach",
      key: t
    };
  }
  sync(t, e, s, r) {
    return {
      operation: "sync",
      key: t,
      without_detaching: r,
      ...e && { attributes: e },
      ...s && { pivot: s }
    };
  }
  toggle(t, e, s) {
    return {
      operation: "toggle",
      key: t,
      ...e && { attributes: e },
      ...s && { pivot: s }
    };
  }
  build() {
    return this.mutate;
  }
};
n(u, "instance");
let y = u;
class q {
  constructor(t, e) {
    n(this, "http");
    n(this, "builder");
    n(this, "pathname");
    n(this, "schema");
    this.http = l.getInstance(), this.builder = y.createBuilder(), this.pathname = t, this.schema = e;
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
  async mutate(t, e) {
    return await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: t
      },
      e
    );
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
class k {
  constructor(t, e) {
    n(this, "http");
    n(this, "pathname");
    n(this, "schema");
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
class O {
  constructor(t, e) {
    n(this, "http");
    n(this, "pathname");
    n(this, "userSchema");
    n(this, "credentialsSchema");
    n(this, "registerDataSchema");
    n(this, "tokenSchema");
    this.http = l.getInstance(), this.pathname = t, this.userSchema = e.user, this.credentialsSchema = e.credentials, this.registerDataSchema = e.registerData, this.tokenSchema = e.tokens;
  }
  /**
   * Inscription
   */
  async register(t, e = {}) {
    this.registerDataSchema && this.registerDataSchema.parse(t);
    try {
      const s = await this.http.request({
        method: "POST",
        url: `${this.pathname}/register`,
        data: t
      }, e), r = this.userSchema.parse(s.user);
      return this.tokenSchema && this.tokenSchema.parse(s.tokens), r;
    } catch (s) {
      throw console.error("Registration error", s), s;
    }
  }
  /**
   * Connexion
   */
  async login(t, e = {}) {
    this.credentialsSchema && this.credentialsSchema.parse(t);
    try {
      const s = await this.http.request({
        method: "POST",
        url: `${this.pathname}/login`,
        data: t
      }, e), r = this.userSchema.parse(s.user), a = this.tokenSchema ? this.tokenSchema.parse(s.tokens) : s.tokens;
      return { user: r, tokens: a };
    } catch (s) {
      throw console.error("Login error", s), s;
    }
  }
  /**
   * Déconnexion
   */
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
  /**
   * Rafraîchissement du token
   */
  async refreshToken(t, e = {}) {
    try {
      const s = await this.http.request({
        method: "POST",
        url: `${this.pathname}/refresh-token`,
        data: { refreshToken: t }
      }, e);
      return this.tokenSchema ? this.tokenSchema.parse(s) : s;
    } catch (s) {
      throw console.error("Token refresh error", s), s;
    }
  }
  /**
   * Récupération de l'utilisateur courant
   */
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
  O as Auth,
  l as HttpClient,
  q as Mutation,
  k as Query
};
//# sourceMappingURL=index.es.js.map

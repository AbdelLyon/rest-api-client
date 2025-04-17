var T = Object.defineProperty;
var R = (c, t, e) => t in c ? T(c, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : c[t] = e;
var a = (c, t, e) => R(c, typeof t != "symbol" ? t + "" : t, e);
class d extends Error {
  constructor(e, s) {
    const r = e instanceof Error ? e.message : "API Service Request Failed";
    super(r);
    a(this, "status");
    a(this, "statusText");
    a(this, "data");
    a(this, "originalError");
    a(this, "requestConfig");
    if (this.name = "ApiRequestError", this.originalError = e, this.requestConfig = s, e && typeof e == "object") {
      const n = e;
      if ("status" in n && (this.status = n.status), "statusText" in n && (this.statusText = n.statusText), "data" in n && (this.data = n.data), "response" in n && n.response instanceof Response) {
        const o = n.response;
        this.status = o.status, this.statusText = o.statusText;
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
  static init(t) {
    var r, n;
    const { httpConfig: e, instanceName: s } = t;
    if (i.requestInterceptors = [
      ...i.requestInterceptors,
      ...((r = e.interceptors) == null ? void 0 : r.request) ?? []
    ], (n = e.interceptors) != null && n.response && (i.responseSuccessInterceptors = [
      ...i.responseSuccessInterceptors,
      ...e.interceptors.response.success ?? []
    ], i.responseErrorInterceptors = [
      ...i.responseErrorInterceptors,
      ...e.interceptors.response.error ?? []
    ]), !this.instances.has(s)) {
      const o = new i();
      o.configure(e), this.instances.set(s, o), this.instances.size === 1 && (this.defaultInstanceName = s);
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
    i.responseErrorInterceptors.length === 0 && i.responseErrorInterceptors.push((t) => (this.logError(t), Promise.reject(t)));
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
    for (const s of i.requestInterceptors)
      e = await Promise.resolve(s(e));
    return e;
  }
  /**
   * Applique les intercepteurs de réponse réussie
   */
  async applyResponseSuccessInterceptors(t) {
    let e = t;
    for (const s of i.responseSuccessInterceptors)
      e = await Promise.resolve(s(e.clone()));
    return e;
  }
  /**
   * Applique les intercepteurs d'erreur de réponse
   */
  async applyResponseErrorInterceptors(t) {
    let e = t;
    for (const s of i.responseErrorInterceptors)
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
      const { timeout: r = this.defaultTimeout, params: n, data: o, ...u } = e;
      let w = t;
      if (n && Object.keys(n).length > 0) {
        const l = new URLSearchParams();
        for (const [f, I] of Object.entries(n))
          l.append(f, I);
        w += `?${l.toString()}`;
      }
      const g = new AbortController(), S = setTimeout(() => g.abort("Request timeout"), r);
      let E;
      o !== void 0 && (E = typeof o == "string" ? o : JSON.stringify(o));
      const m = await fetch(w, {
        ...u,
        body: E,
        signal: g.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(S), !m.ok && s < this.maxRetries && this.isRetryableError(m.status, e.method)) {
        const l = Math.pow(2, s) * 100;
        return await new Promise((f) => setTimeout(f, l)), this.fetchWithRetry(t, e, s + 1);
      }
      return m;
    } catch (r) {
      if (r instanceof DOMException && r.name === "AbortError")
        throw new Error(`Request timeout after ${e.timeout || this.defaultTimeout}ms`);
      if (s < this.maxRetries && this.isRetryableError(0, e.method)) {
        const n = Math.pow(2, s) * 100;
        return await new Promise((o) => setTimeout(o, n)), this.fetchWithRetry(t, e, s + 1);
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
      }, n = new URL(
        r.url.startsWith("http") ? r.url : `${this.baseURL}${r.url.startsWith("/") ? "" : "/"}${r.url}`
      ).toString(), o = await this.applyRequestInterceptors({
        ...r,
        url: n
      });
      let u = await this.fetchWithRetry(n, o);
      return u = await this.applyResponseSuccessInterceptors(u), (s = u.headers.get("content-type")) != null && s.includes("application/json") ? await u.json() : await u.text();
    } catch (r) {
      const n = r instanceof d ? r : new d(r, {
        ...t,
        ...e,
        url: t.url
      });
      return this.applyResponseErrorInterceptors(n);
    }
  }
};
a(i, "instances", /* @__PURE__ */ new Map()), a(i, "defaultInstanceName"), // Intercepteurs statiques
a(i, "requestInterceptors", []), a(i, "responseSuccessInterceptors", []), a(i, "responseErrorInterceptors", []);
let p = i;
const h = class h {
  constructor() {
    a(this, "request", {
      mutate: []
    });
  }
  /**
   * Récupère l'instance unique du Builder (pattern Singleton)
   */
  static getInstance() {
    return h.instance || (h.instance = new h()), h.instance;
  }
  /**
   * Crée une nouvelle instance du Builder
   */
  createBuilder() {
    return new h();
  }
  /**
   * Ajoute une opération de création à la requête
   * @param attributes Attributs de l'objet à créer
   * @param relations Relations à associer à l'objet créé
   */
  createEntity(t, e) {
    const s = {
      operation: "create",
      attributes: t,
      ...e && { relations: e }
    };
    return this.request.mutate.push(s), this;
  }
  /**
   * Ajoute une opération de mise à jour à la requête
   * @param key ID de l'objet à mettre à jour
   * @param attributes Attributs à mettre à jour
   * @param relations Relations à mettre à jour
   */
  update(t, e, s) {
    const r = {
      operation: "update",
      key: t,
      attributes: e,
      ...s && { relations: s }
    };
    return this.request.mutate.push(r), this;
  }
  /**
   * Construit et retourne l'objet de requête final
   */
  build() {
    return this.request;
  }
  // Méthodes de l'ancienne classe RelationBuilder
  /**
   * Crée une définition de relation de type "create"
   */
  createRelation(t, e) {
    return {
      operation: "create",
      attributes: t,
      ...e && { relations: e }
    };
  }
  /**
   * Crée une définition de relation de type "update"
   */
  updateRelation(t, e, s) {
    return {
      operation: "update",
      key: t,
      attributes: e,
      ...s && { relations: s }
    };
  }
  /**
   * Crée une définition de relation de type "attach"
   */
  attach(t) {
    return {
      operation: "attach",
      key: t
    };
  }
  /**
   * Crée une définition de relation de type "detach"
   */
  detach(t) {
    return {
      operation: "detach",
      key: t
    };
  }
  /**
   * Crée une définition de relation de type "sync"
   */
  sync(t, e, s, r) {
    return {
      operation: "sync",
      key: t,
      without_detaching: r,
      ...e && { attributes: e },
      ...s && { pivot: s }
    };
  }
  /**
   * Crée une définition de relation de type "toggle"
   */
  toggle(t, e, s) {
    return {
      operation: "toggle",
      key: t,
      ...e && { attributes: e },
      ...s && { pivot: s }
    };
  }
};
a(h, "instance");
let y = h;
class P {
  constructor(t, e) {
    a(this, "http");
    a(this, "builder");
    a(this, "pathname");
    a(this, "schema");
    this.http = p.getInstance(), this.builder = y.getInstance(), this.pathname = t, this.schema = e;
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
    a(this, "http");
    a(this, "pathname");
    a(this, "schema");
    this.http = p.getInstance(), this.pathname = t, this.schema = e;
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
class b {
  constructor(t, e) {
    a(this, "http");
    a(this, "pathname");
    a(this, "userSchema");
    a(this, "credentialsSchema");
    a(this, "registerDataSchema");
    a(this, "tokenSchema");
    this.http = p.getInstance(), this.pathname = t, this.userSchema = e.user, this.credentialsSchema = e.credentials, this.registerDataSchema = e.registerData, this.tokenSchema = e.tokens;
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
      }, e), r = this.userSchema.parse(s.user), n = this.tokenSchema ? this.tokenSchema.parse(s.tokens) : s.tokens;
      return { user: r, tokens: n };
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
  b as Auth,
  p as HttpClient,
  P as Mutation,
  k as Query
};
//# sourceMappingURL=index.es.js.map

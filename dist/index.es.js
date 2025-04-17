var R = Object.defineProperty;
var I = (h, t, e) => t in h ? R(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var a = (h, t, e) => I(h, typeof t != "symbol" ? t + "" : t, e);
class d extends Error {
  constructor(e, r) {
    const s = e instanceof Error ? e.message : "API Service Request Failed";
    super(s);
    a(this, "status");
    a(this, "statusText");
    a(this, "data");
    a(this, "originalError");
    a(this, "requestConfig");
    if (this.name = "ApiRequestError", this.originalError = e, this.requestConfig = r, e && typeof e == "object") {
      const i = e;
      if ("status" in i && (this.status = i.status), "statusText" in i && (this.statusText = i.statusText), "data" in i && (this.data = i.data), "response" in i && i.response instanceof Response) {
        const o = i.response;
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
  static init(t) {
    var s, i;
    const { httpConfig: e, instanceName: r } = t;
    if (n.requestInterceptors = [
      ...n.requestInterceptors,
      ...((s = e.interceptors) == null ? void 0 : s.request) ?? []
    ], (i = e.interceptors) != null && i.response && (n.responseSuccessInterceptors = [
      ...n.responseSuccessInterceptors,
      ...e.interceptors.response.success ?? []
    ], n.responseErrorInterceptors = [
      ...n.responseErrorInterceptors,
      ...e.interceptors.response.error ?? []
    ]), !this.instances.has(r)) {
      const o = new n();
      o.configure(e), this.instances.set(r, o), this.instances.size === 1 && (this.defaultInstanceName = r);
    }
    return this.instances.get(r);
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
      let r = t.apiPrefix.trim();
      return r.startsWith("/") || (r = "/" + r), r.endsWith("/") && (r = r.slice(0, -1)), e + r;
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
    var r, s;
    const e = {
      url: (r = t.config) == null ? void 0 : r.url,
      method: (s = t.config) == null ? void 0 : s.method,
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
    for (const r of n.requestInterceptors)
      e = await Promise.resolve(r(e));
    return e;
  }
  /**
   * Applique les intercepteurs de réponse réussie
   */
  async applyResponseSuccessInterceptors(t) {
    let e = t;
    for (const r of n.responseSuccessInterceptors)
      e = await Promise.resolve(r(e.clone()));
    return e;
  }
  /**
   * Applique les intercepteurs d'erreur de réponse
   */
  async applyResponseErrorInterceptors(t) {
    let e = t;
    for (const r of n.responseErrorInterceptors)
      try {
        if (e = await Promise.resolve(r(e)), !(e instanceof Error))
          return e;
      } catch (s) {
        e = s;
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
  async fetchWithRetry(t, e, r = 1) {
    try {
      const { timeout: s = this.defaultTimeout, params: i, data: o, ...u } = e;
      let w = t;
      if (i && Object.keys(i).length > 0) {
        const p = new URLSearchParams();
        for (const [f, S] of Object.entries(i))
          p.append(f, S);
        w += `?${p.toString()}`;
      }
      const y = new AbortController(), E = setTimeout(() => y.abort("Request timeout"), s);
      let g;
      o !== void 0 && (g = typeof o == "string" ? o : JSON.stringify(o));
      const m = await fetch(w, {
        ...u,
        body: g,
        signal: y.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(E), !m.ok && r < this.maxRetries && this.isRetryableError(m.status, e.method)) {
        const p = Math.pow(2, r) * 100;
        return await new Promise((f) => setTimeout(f, p)), this.fetchWithRetry(t, e, r + 1);
      }
      return m;
    } catch (s) {
      if (s instanceof DOMException && s.name === "AbortError")
        throw new Error(`Request timeout after ${e.timeout || this.defaultTimeout}ms`);
      if (r < this.maxRetries && this.isRetryableError(0, e.method)) {
        const i = Math.pow(2, r) * 100;
        return await new Promise((o) => setTimeout(o, i)), this.fetchWithRetry(t, e, r + 1);
      }
      throw s;
    }
  }
  /**
   * Méthode principale pour effectuer une requête
   */
  async request(t, e = {}) {
    var r;
    try {
      const s = {
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
        s.url.startsWith("http") ? s.url : `${this.baseURL}${s.url.startsWith("/") ? "" : "/"}${s.url}`
      ).toString(), o = await this.applyRequestInterceptors({
        ...s,
        url: i
      });
      let u = await this.fetchWithRetry(i, o);
      return u = await this.applyResponseSuccessInterceptors(u), (r = u.headers.get("content-type")) != null && r.includes("application/json") ? await u.json() : await u.text();
    } catch (s) {
      const i = s instanceof d ? s : new d(s, {
        ...t,
        ...e,
        url: t.url
      });
      return this.applyResponseErrorInterceptors(i);
    }
  }
};
a(n, "instances", /* @__PURE__ */ new Map()), a(n, "defaultInstanceName"), // Intercepteurs statiques
a(n, "requestInterceptors", []), a(n, "responseSuccessInterceptors", []), a(n, "responseErrorInterceptors", []);
let l = n;
class c {
  constructor(t = "root") {
    a(this, "mutate", []);
    this.context = t;
  }
  /**
   * Crée une nouvelle instance du Builder
   */
  static createBuilder() {
    return new c("root");
  }
  /**
   * Ajoute une opération de création à la requête
   * Disponible seulement dans les contextes root ou create
   */
  createEntity(t, e) {
    const r = {
      operation: "create",
      attributes: t,
      ...e && { relations: e }
    };
    return this.mutate.push(r), this;
  }
  /**
   * Ajoute une opération de mise à jour à la requête
   * Disponible seulement dans les contextes root ou update
   */
  update(t, e, r) {
    const s = {
      operation: "update",
      key: t,
      attributes: e,
      ...r && { relations: r }
    };
    return this.mutate.push(s), this;
  }
  /**
   * Construit et retourne l'objet de requête final
   */
  build() {
    return this.mutate;
  }
  // Méthodes pour créer des relations avec contexte ET typage générique
  /**
   * Crée une définition de relation de type "create"
   */
  createRelation(t, e) {
    return new c("create").withRelations({
      operation: "create",
      attributes: t,
      ...e && { relations: e }
    });
  }
  /**
   * Crée une définition de relation de type "update"
   */
  updateRelation(t, e, r) {
    return new c("update").withRelations({
      operation: "update",
      key: t,
      attributes: e,
      ...r && { relations: r }
    });
  }
  /**
   * Crée une définition de relation de type "attach"
   */
  attach(t) {
    return new c("attach").withRelations({
      operation: "attach",
      key: t
    });
  }
  /**
   * Crée une définition de relation de type "detach"
   */
  detach(t) {
    return new c("detach").withRelations({
      operation: "detach",
      key: t
    });
  }
  /**
   * Crée une définition de relation de type "sync"
   */
  sync(t, e, r, s) {
    return new c("sync").withRelations({
      operation: "sync",
      key: t,
      without_detaching: s,
      ...e && { attributes: e },
      ...r && { pivot: r }
    });
  }
  /**
   * Crée une définition de relation de type "toggle"
   */
  toggle(t, e, r) {
    return new c("toggle").withRelations({
      operation: "toggle",
      key: t,
      ...e && { attributes: e },
      ...r && { pivot: r }
    });
  }
  // Méthode interne pour gérer la relation
  withRelations(t) {
    return t;
  }
  // Méthode pour suggérer les opérations valides dans le contexte courant
  getValidOperations() {
    return {
      root: ["create", "update"],
      create: ["create", "attach", "sync"],
      update: ["update", "attach", "detach", "sync", "toggle"],
      attach: [],
      detach: [],
      sync: [],
      toggle: []
    }[this.context];
  }
}
class q {
  constructor(t, e) {
    a(this, "http");
    a(this, "builder");
    a(this, "pathname");
    a(this, "schema");
    this.http = l.getInstance(), this.builder = c.createBuilder(), this.pathname = t, this.schema = e;
  }
  validateData(t) {
    return t.map((e) => {
      const r = this.schema.safeParse(e);
      if (!r.success)
        throw console.error("Type validation failed:", r.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(r.error.errors)}`
        );
      return r.data;
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
    const r = await this.http.request(
      {
        method: "DELETE",
        url: this.pathname,
        data: t
      },
      e
    );
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
  async forceDelete(t, e = {}) {
    const r = await this.http.request(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: t
      },
      e
    );
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
  async restore(t, e = {}) {
    const r = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: t
      },
      e
    );
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
}
class P {
  constructor(t, e) {
    a(this, "http");
    a(this, "pathname");
    a(this, "schema");
    this.http = l.getInstance(), this.pathname = t, this.schema = e;
  }
  validateData(t) {
    return t.map((e) => {
      const r = this.schema.safeParse(e);
      if (!r.success)
        throw console.error("Type validation failed:", r.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(r.error.errors)}`
        );
      return r.data;
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
    const r = await this.searchRequest(t, e);
    return this.validateData(r.data);
  }
  async searchPaginate(t, e = {}) {
    const r = await this.searchRequest(t, e);
    return {
      ...r,
      data: this.validateData(r.data)
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
class k {
  constructor(t, e) {
    a(this, "http");
    a(this, "pathname");
    a(this, "userSchema");
    a(this, "credentialsSchema");
    a(this, "registerDataSchema");
    a(this, "tokenSchema");
    this.http = l.getInstance(), this.pathname = t, this.userSchema = e.user, this.credentialsSchema = e.credentials, this.registerDataSchema = e.registerData, this.tokenSchema = e.tokens;
  }
  /**
   * Inscription
   */
  async register(t, e = {}) {
    this.registerDataSchema && this.registerDataSchema.parse(t);
    try {
      const r = await this.http.request({
        method: "POST",
        url: `${this.pathname}/register`,
        data: t
      }, e), s = this.userSchema.parse(r.user);
      return this.tokenSchema && this.tokenSchema.parse(r.tokens), s;
    } catch (r) {
      throw console.error("Registration error", r), r;
    }
  }
  /**
   * Connexion
   */
  async login(t, e = {}) {
    this.credentialsSchema && this.credentialsSchema.parse(t);
    try {
      const r = await this.http.request({
        method: "POST",
        url: `${this.pathname}/login`,
        data: t
      }, e), s = this.userSchema.parse(r.user), i = this.tokenSchema ? this.tokenSchema.parse(r.tokens) : r.tokens;
      return { user: s, tokens: i };
    } catch (r) {
      throw console.error("Login error", r), r;
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
  k as Auth,
  l as HttpClient,
  q as Mutation,
  P as Query
};
//# sourceMappingURL=index.es.js.map

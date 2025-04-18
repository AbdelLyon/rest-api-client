var S = Object.defineProperty;
var I = (u, t, e) => t in u ? S(u, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : u[t] = e;
var o = (u, t, e) => I(u, typeof t != "symbol" ? t + "" : t, e);
class d extends Error {
  constructor(e, s) {
    const r = e instanceof Error ? e.message : "API Service Request Failed";
    super(r);
    o(this, "status");
    o(this, "statusText");
    o(this, "data");
    o(this, "originalError");
    o(this, "requestConfig");
    if (this.name = "ApiRequestError", this.originalError = e, this.requestConfig = s, e && typeof e == "object") {
      const a = e;
      if ("status" in a && (this.status = a.status), "statusText" in a && (this.statusText = a.statusText), "data" in a && (this.data = a.data), "response" in a && a.response instanceof Response) {
        const n = a.response;
        this.status = n.status, this.statusText = n.statusText;
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
const c = class c {
  constructor() {
    o(this, "baseURL");
    o(this, "defaultTimeout");
    o(this, "defaultHeaders");
    o(this, "withCredentials");
    o(this, "maxRetries");
    this.baseURL = "", this.defaultTimeout = 1e4, this.defaultHeaders = {}, this.withCredentials = !0, this.maxRetries = 3;
  }
  /**
   * Initialise une nouvelle instance HTTP avec intercepteurs
   */
  static init(t) {
    var r, a;
    const { httpConfig: e, instanceName: s } = t;
    if (c.requestInterceptors = [
      ...c.requestInterceptors,
      ...((r = e.interceptors) == null ? void 0 : r.request) ?? []
    ], (a = e.interceptors) != null && a.response && (c.responseSuccessInterceptors = [
      ...c.responseSuccessInterceptors,
      ...e.interceptors.response.success ?? []
    ], c.responseErrorInterceptors = [
      ...c.responseErrorInterceptors,
      ...e.interceptors.response.error ?? []
    ]), !this.instances.has(s)) {
      const n = new c();
      n.configure(e), this.instances.set(s, n), this.instances.size === 1 && (this.defaultInstanceName = s);
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
    c.responseErrorInterceptors.length === 0 && c.responseErrorInterceptors.push((t) => (this.logError(t), Promise.reject(t)));
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
    for (const s of c.requestInterceptors)
      e = await Promise.resolve(s(e));
    return e;
  }
  /**
   * Applique les intercepteurs de réponse réussie
   */
  async applyResponseSuccessInterceptors(t) {
    let e = t;
    for (const s of c.responseSuccessInterceptors)
      e = await Promise.resolve(s(e.clone()));
    return e;
  }
  /**
   * Applique les intercepteurs d'erreur de réponse
   */
  async applyResponseErrorInterceptors(t) {
    let e = t;
    for (const s of c.responseErrorInterceptors)
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
      const { timeout: r = this.defaultTimeout, params: a, data: n, ...i } = e;
      let h = t;
      if (a && Object.keys(a).length > 0) {
        const l = new URLSearchParams();
        for (const [m, b] of Object.entries(a))
          l.append(m, b);
        h += `?${l.toString()}`;
      }
      const w = new AbortController(), E = setTimeout(() => w.abort("Request timeout"), r);
      let g;
      n !== void 0 && (g = typeof n == "string" ? n : JSON.stringify(n));
      const f = await fetch(h, {
        ...i,
        body: g,
        signal: w.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(E), !f.ok && s < this.maxRetries && this.isRetryableError(f.status, e.method)) {
        const l = Math.pow(2, s) * 100;
        return await new Promise((m) => setTimeout(m, l)), this.fetchWithRetry(t, e, s + 1);
      }
      return f;
    } catch (r) {
      if (r instanceof DOMException && r.name === "AbortError")
        throw new Error(`Request timeout after ${e.timeout || this.defaultTimeout}ms`);
      if (s < this.maxRetries && this.isRetryableError(0, e.method)) {
        const a = Math.pow(2, s) * 100;
        return await new Promise((n) => setTimeout(n, a)), this.fetchWithRetry(t, e, s + 1);
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
      ).toString(), n = await this.applyRequestInterceptors({
        ...r,
        url: a
      });
      let i = await this.fetchWithRetry(a, n);
      return i = await this.applyResponseSuccessInterceptors(i), (s = i.headers.get("content-type")) != null && s.includes("application/json") ? await i.json() : await i.text();
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
o(c, "instances", /* @__PURE__ */ new Map()), o(c, "defaultInstanceName"), // Intercepteurs statiques
o(c, "requestInterceptors", []), o(c, "responseSuccessInterceptors", []), o(c, "responseErrorInterceptors", []);
let p = c;
class y {
  constructor() {
    o(this, "operations", []);
    o(this, "mutationFn", null);
  }
  static createBuilder() {
    return new y();
  }
  // Méthode pour définir la fonction de mutation
  setMutationFunction(t) {
    this.mutationFn = t;
  }
  /**
   * Crée une entité avec les attributs donnés, y compris des relations imbriquées
   * @param attributes Les attributs de l'entité, pouvant contenir des relations
   */
  createEntity(t) {
    const e = {}, s = {};
    for (const [a, n] of Object.entries(t))
      n && typeof n == "object" && "operation" in n ? s[a] = n : e[a] = n;
    const r = {
      operation: "create",
      attributes: e,
      relations: s
    };
    return this.operations.push(r), this;
  }
  /**
   * Met à jour une entité avec les attributs donnés, y compris des relations imbriquées
   * @param key La clé de l'entité à mettre à jour
   * @param attributes Les attributs de l'entité, pouvant contenir des relations
   */
  updateEntity(t, e) {
    const s = {}, r = {};
    for (const [n, i] of Object.entries(e))
      i && typeof i == "object" && "operation" in i ? r[n] = i : s[n] = i;
    const a = {
      operation: "update",
      key: t,
      attributes: s,
      relations: r
    };
    return this.operations.push(a), this;
  }
  /**
   * Crée une relation avec des attributs donnés et des relations optionnelles.
   * @param attributes Les attributs de la relation
   * @param relations Les relations imbriquées explicites (optionnel)
   */
  createRelation(t, e) {
    const s = {}, r = {};
    if (!e && t && typeof t == "object")
      for (const [n, i] of Object.entries(t))
        i && typeof i == "object" && "operation" in i ? r[n] = i : s[n] = i;
    else if (t && typeof t == "object")
      for (const [n, i] of Object.entries(t))
        i && typeof i == "object" && "operation" in i || (s[n] = i);
    const a = {
      operation: "create",
      attributes: s,
      // Utiliser les relations explicites si fournies, sinon utiliser celles extraites des attributs
      ...e ? { relations: e } : Object.keys(r).length > 0 ? { relations: r } : {},
      __relationDefinition: !0
    };
    if (t && typeof t == "object")
      for (const n of Object.keys(s))
        Object.defineProperty(a, n, {
          get() {
            return s[n];
          },
          enumerable: !0
        });
    return a;
  }
  /**
   * Met à jour une relation avec des attributs donnés et des relations optionnelles.
   * @param key La clé de la relation à mettre à jour
   * @param attributes Les attributs de la relation
   * @param relations Les relations imbriquées explicites (optionnel)
   */
  updateRelation(t, e, s) {
    const r = {}, a = {};
    if (!s && e && typeof e == "object")
      for (const [i, h] of Object.entries(e))
        h && typeof h == "object" && "operation" in h ? a[i] = h : r[i] = h;
    else if (e && typeof e == "object")
      for (const [i, h] of Object.entries(e))
        h && typeof h == "object" && "operation" in h || (r[i] = h);
    const n = {
      operation: "update",
      key: t,
      attributes: r,
      // Utiliser les relations explicites si fournies, sinon utiliser celles extraites des attributs
      ...s ? { relations: s } : Object.keys(a).length > 0 ? { relations: a } : {},
      __relationDefinition: !0
    };
    if (e && typeof e == "object")
      for (const i of Object.keys(r))
        Object.defineProperty(n, i, {
          get() {
            return r[i];
          },
          enumerable: !0
        });
    return n;
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
    const t = [...this.operations];
    return this.operations = [], { mutate: t };
  }
  async mutate(t) {
    if (!this.mutationFn)
      throw new Error("Mutation function not provided to builder");
    const e = this.build();
    return this.mutationFn(e, t);
  }
}
class R {
  constructor(t, e) {
    o(this, "http");
    o(this, "pathname");
    o(this, "schema");
    this.http = p.getInstance(), this.pathname = t, this.schema = e;
  }
  builder() {
    const t = y.createBuilder();
    return t.setMutationFunction((e, s) => this.mutate(e, s)), t;
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
    const s = "build" in t ? t.build() : t;
    return await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: s
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
class j {
  constructor(t, e) {
    o(this, "http");
    o(this, "pathname");
    o(this, "schema");
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
class k {
  constructor(t, e) {
    o(this, "http");
    o(this, "pathname");
    o(this, "userSchema");
    o(this, "credentialsSchema");
    o(this, "registerDataSchema");
    o(this, "tokenSchema");
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
  k as Auth,
  p as HttpClient,
  R as Mutation,
  j as Query
};
//# sourceMappingURL=index.es.js.map

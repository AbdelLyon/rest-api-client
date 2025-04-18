var I = Object.defineProperty;
var R = (u, e, t) => e in u ? I(u, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[e] = t;
var o = (u, e, t) => R(u, typeof e != "symbol" ? e + "" : e, t);
class f extends Error {
  constructor(t, s) {
    const r = t instanceof Error ? t.message : "API Service Request Failed";
    super(r);
    o(this, "status");
    o(this, "statusText");
    o(this, "data");
    o(this, "originalError");
    o(this, "requestConfig");
    if (this.name = "ApiRequestError", this.originalError = t, this.requestConfig = s, t && typeof t == "object") {
      const a = t;
      if ("status" in a && (this.status = a.status), "statusText" in a && (this.statusText = a.statusText), "data" in a && (this.data = a.data), "response" in a && a.response instanceof Response) {
        const n = a.response;
        this.status = n.status, this.statusText = n.statusText;
      }
    }
    Error.captureStackTrace && Error.captureStackTrace(this, f);
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
  static init(e) {
    var r, a;
    const { httpConfig: t, instanceName: s } = e;
    if (c.requestInterceptors = [
      ...c.requestInterceptors,
      ...((r = t.interceptors) == null ? void 0 : r.request) ?? []
    ], (a = t.interceptors) != null && a.response && (c.responseSuccessInterceptors = [
      ...c.responseSuccessInterceptors,
      ...t.interceptors.response.success ?? []
    ], c.responseErrorInterceptors = [
      ...c.responseErrorInterceptors,
      ...t.interceptors.response.error ?? []
    ]), !this.instances.has(s)) {
      const n = new c();
      n.configure(t), this.instances.set(s, n), this.instances.size === 1 && (this.defaultInstanceName = s);
    }
    return this.instances.get(s);
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
    c.responseErrorInterceptors.length === 0 && c.responseErrorInterceptors.push((e) => (this.logError(e), Promise.reject(e)));
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
    for (const s of c.requestInterceptors)
      t = await Promise.resolve(s(t));
    return t;
  }
  /**
   * Applique les intercepteurs de réponse réussie
   */
  async applyResponseSuccessInterceptors(e) {
    let t = e;
    for (const s of c.responseSuccessInterceptors)
      t = await Promise.resolve(s(t.clone()));
    return t;
  }
  /**
   * Applique les intercepteurs d'erreur de réponse
   */
  async applyResponseErrorInterceptors(e) {
    let t = e;
    for (const s of c.responseErrorInterceptors)
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
      const { timeout: r = this.defaultTimeout, params: a, data: n, ...i } = t;
      let h = e;
      if (a && Object.keys(a).length > 0) {
        const d = new URLSearchParams();
        for (const [y, b] of Object.entries(a))
          d.append(y, b);
        h += `?${d.toString()}`;
      }
      const w = new AbortController(), S = setTimeout(() => w.abort("Request timeout"), r);
      let E;
      n !== void 0 && (E = typeof n == "string" ? n : JSON.stringify(n));
      const m = await fetch(h, {
        ...i,
        body: E,
        signal: w.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(S), !m.ok && s < this.maxRetries && this.isRetryableError(m.status, t.method)) {
        const d = Math.pow(2, s) * 100;
        return await new Promise((y) => setTimeout(y, d)), this.fetchWithRetry(e, t, s + 1);
      }
      return m;
    } catch (r) {
      if (r instanceof DOMException && r.name === "AbortError")
        throw new Error(`Request timeout after ${t.timeout || this.defaultTimeout}ms`);
      if (s < this.maxRetries && this.isRetryableError(0, t.method)) {
        const a = Math.pow(2, s) * 100;
        return await new Promise((n) => setTimeout(n, a)), this.fetchWithRetry(e, t, s + 1);
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
      }, a = new URL(
        r.url.startsWith("http") ? r.url : `${this.baseURL}${r.url.startsWith("/") ? "" : "/"}${r.url}`
      ).toString(), n = await this.applyRequestInterceptors({
        ...r,
        url: a
      });
      let i = await this.fetchWithRetry(a, n);
      return i = await this.applyResponseSuccessInterceptors(i), (s = i.headers.get("content-type")) != null && s.includes("application/json") ? await i.json() : await i.text();
    } catch (r) {
      const a = r instanceof f ? r : new f(r, {
        ...e,
        ...t,
        url: e.url
      });
      return this.applyResponseErrorInterceptors(a);
    }
  }
};
o(c, "instances", /* @__PURE__ */ new Map()), o(c, "defaultInstanceName"), // Intercepteurs statiques
o(c, "requestInterceptors", []), o(c, "responseSuccessInterceptors", []), o(c, "responseErrorInterceptors", []);
let l = c;
const p = class p {
  constructor() {
    o(this, "mutate", []);
  }
  static createBuilder() {
    return p.instance || (p.instance = new p()), p.instance;
  }
  /**
   * Crée une entité avec les attributs donnés, y compris des relations imbriquées
   * @param attributes Les attributs de l'entité, pouvant contenir des relations
   */
  createEntity(e) {
    const t = {}, s = {};
    for (const [a, n] of Object.entries(e))
      n && typeof n == "object" && "operation" in n ? s[a] = n : t[a] = n;
    const r = {
      operation: "create",
      attributes: t,
      ...Object.keys(s).length > 0 && { relations: s }
    };
    return this.mutate.push(r), this;
  }
  /**
   * Met à jour une entité avec les attributs donnés, y compris des relations imbriquées
   * @param key La clé de l'entité à mettre à jour
   * @param attributes Les attributs de l'entité, pouvant contenir des relations
   */
  updateEntity(e, t) {
    const s = {}, r = {};
    for (const [n, i] of Object.entries(t))
      i && typeof i == "object" && "operation" in i ? r[n] = i : s[n] = i;
    const a = {
      operation: "update",
      key: e,
      attributes: s,
      ...Object.keys(r).length > 0 && { relations: r }
    };
    return this.mutate.push(a), this;
  }
  /**
   * Crée une relation avec des attributs donnés et des relations optionnelles.
   * @param attributes Les attributs de la relation
   * @param relations Les relations imbriquées explicites (optionnel)
   */
  createRelation(e, t) {
    const s = {}, r = {};
    if (!t && e && typeof e == "object")
      for (const [n, i] of Object.entries(e))
        i && typeof i == "object" && "operation" in i ? r[n] = i : s[n] = i;
    else if (e && typeof e == "object")
      for (const [n, i] of Object.entries(e))
        i && typeof i == "object" && "operation" in i || (s[n] = i);
    const a = {
      operation: "create",
      attributes: s,
      // Utiliser les relations explicites si fournies, sinon utiliser celles extraites des attributs
      ...t ? { relations: t } : Object.keys(r).length > 0 ? { relations: r } : {},
      __relationDefinition: !0
    };
    if (e && typeof e == "object")
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
  updateRelation(e, t, s) {
    const r = {}, a = {};
    if (!s && t && typeof t == "object")
      for (const [i, h] of Object.entries(t))
        h && typeof h == "object" && "operation" in h ? a[i] = h : r[i] = h;
    else if (t && typeof t == "object")
      for (const [i, h] of Object.entries(t))
        h && typeof h == "object" && "operation" in h || (r[i] = h);
    const n = {
      operation: "update",
      key: e,
      attributes: r,
      // Utiliser les relations explicites si fournies, sinon utiliser celles extraites des attributs
      ...s ? { relations: s } : Object.keys(a).length > 0 ? { relations: a } : {},
      __relationDefinition: !0
    };
    if (t && typeof t == "object")
      for (const i of Object.keys(r))
        Object.defineProperty(n, i, {
          get() {
            return r[i];
          },
          enumerable: !0
        });
    return n;
  }
  attach(e) {
    return {
      operation: "attach",
      key: e
    };
  }
  detach(e) {
    return {
      operation: "detach",
      key: e
    };
  }
  sync(e, t, s, r) {
    return {
      operation: "sync",
      key: e,
      without_detaching: r,
      ...t && { attributes: t },
      ...s && { pivot: s }
    };
  }
  toggle(e, t, s) {
    return {
      operation: "toggle",
      key: e,
      ...t && { attributes: t },
      ...s && { pivot: s }
    };
  }
  build() {
    return this.mutate;
  }
};
o(p, "instance");
let g = p;
class j {
  constructor(e, t) {
    o(this, "http");
    o(this, "builder");
    o(this, "pathname");
    o(this, "schema");
    this.http = l.getInstance(), this.builder = g.createBuilder(), this.pathname = e, this.schema = t;
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
  async mutate(e, t) {
    return await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: e
      },
      t
    );
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
class k {
  constructor(e, t) {
    o(this, "http");
    o(this, "pathname");
    o(this, "schema");
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
class O {
  constructor(e, t) {
    o(this, "http");
    o(this, "pathname");
    o(this, "userSchema");
    o(this, "credentialsSchema");
    o(this, "registerDataSchema");
    o(this, "tokenSchema");
    this.http = l.getInstance(), this.pathname = e, this.userSchema = t.user, this.credentialsSchema = t.credentials, this.registerDataSchema = t.registerData, this.tokenSchema = t.tokens;
  }
  /**
   * Inscription
   */
  async register(e, t = {}) {
    this.registerDataSchema && this.registerDataSchema.parse(e);
    try {
      const s = await this.http.request({
        method: "POST",
        url: `${this.pathname}/register`,
        data: e
      }, t), r = this.userSchema.parse(s.user);
      return this.tokenSchema && this.tokenSchema.parse(s.tokens), r;
    } catch (s) {
      throw console.error("Registration error", s), s;
    }
  }
  /**
   * Connexion
   */
  async login(e, t = {}) {
    this.credentialsSchema && this.credentialsSchema.parse(e);
    try {
      const s = await this.http.request({
        method: "POST",
        url: `${this.pathname}/login`,
        data: e
      }, t), r = this.userSchema.parse(s.user), a = this.tokenSchema ? this.tokenSchema.parse(s.tokens) : s.tokens;
      return { user: r, tokens: a };
    } catch (s) {
      throw console.error("Login error", s), s;
    }
  }
  /**
   * Déconnexion
   */
  async logout(e = {}) {
    try {
      await this.http.request({
        method: "POST",
        url: `${this.pathname}/logout`
      }, e);
    } catch (t) {
      throw console.error("Logout error", t), t;
    }
  }
  /**
   * Rafraîchissement du token
   */
  async refreshToken(e, t = {}) {
    try {
      const s = await this.http.request({
        method: "POST",
        url: `${this.pathname}/refresh-token`,
        data: { refreshToken: e }
      }, t);
      return this.tokenSchema ? this.tokenSchema.parse(s) : s;
    } catch (s) {
      throw console.error("Token refresh error", s), s;
    }
  }
  /**
   * Récupération de l'utilisateur courant
   */
  async getCurrentUser(e = {}) {
    try {
      const t = await this.http.request({
        method: "GET",
        url: `${this.pathname}/me`
      }, e);
      return this.userSchema.parse(t);
    } catch (t) {
      throw console.error("Get current user error", t), t;
    }
  }
}
export {
  O as Auth,
  l as HttpClient,
  j as Mutation,
  k as Query
};
//# sourceMappingURL=index.es.js.map

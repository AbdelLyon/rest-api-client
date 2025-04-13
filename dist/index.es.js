var S = Object.defineProperty;
var I = (h, t, e) => t in h ? S(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var r = (h, t, e) => I(h, typeof t != "symbol" ? t + "" : t, e);
class p extends Error {
  constructor(e, s) {
    const a = e instanceof Error ? e.message : "API Service Request Failed";
    super(a);
    r(this, "status");
    r(this, "statusText");
    r(this, "data");
    r(this, "originalError");
    r(this, "requestConfig");
    if (this.name = "ApiRequestError", this.originalError = e, this.requestConfig = s, e && typeof e == "object") {
      const i = e;
      if ("status" in i && (this.status = i.status), "statusText" in i && (this.statusText = i.statusText), "data" in i && (this.data = i.data), "response" in i && i.response instanceof Response) {
        const o = i.response;
        this.status = o.status, this.statusText = o.statusText;
      }
    }
    Error.captureStackTrace && Error.captureStackTrace(this, p);
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
    r(this, "baseURL");
    r(this, "defaultTimeout");
    r(this, "defaultHeaders");
    r(this, "withCredentials");
    r(this, "maxRetries");
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
      const { timeout: a = this.defaultTimeout, params: i, data: o, ...c } = e;
      let m = t;
      if (i && Object.keys(i).length > 0) {
        const l = new URLSearchParams();
        for (const [f, E] of Object.entries(i))
          l.append(f, E);
        m += `?${l.toString()}`;
      }
      const y = new AbortController(), g = setTimeout(() => y.abort("Request timeout"), a);
      let w;
      o !== void 0 && (w = typeof o == "string" ? o : JSON.stringify(o));
      const d = await fetch(m, {
        ...c,
        body: w,
        signal: y.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(g), !d.ok && s < this.maxRetries && this.isRetryableError(d.status, e.method)) {
        const l = Math.pow(2, s) * 100;
        return await new Promise((f) => setTimeout(f, l)), this.fetchWithRetry(t, e, s + 1);
      }
      return d;
    } catch (a) {
      if (a instanceof DOMException && a.name === "AbortError")
        throw new Error(`Request timeout after ${e.timeout || this.defaultTimeout}ms`);
      if (s < this.maxRetries && this.isRetryableError(0, e.method)) {
        const i = Math.pow(2, s) * 100;
        return await new Promise((o) => setTimeout(o, i)), this.fetchWithRetry(t, e, s + 1);
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
      }, i = new URL(
        a.url.startsWith("http") ? a.url : `${this.baseURL}${a.url.startsWith("/") ? "" : "/"}${a.url}`
      ).toString(), o = await this.applyRequestInterceptors({
        ...a,
        url: i
      });
      let c = await this.fetchWithRetry(i, o);
      return c = await this.applyResponseSuccessInterceptors(c), (s = c.headers.get("content-type")) != null && s.includes("application/json") ? await c.json() : await c.text();
    } catch (a) {
      const i = a instanceof p ? a : new p(a, {
        ...t,
        ...e,
        url: t.url
      });
      return this.applyResponseErrorInterceptors(i);
    }
  }
};
r(n, "instances", /* @__PURE__ */ new Map()), r(n, "defaultInstanceName", "default"), // Intercepteurs statiques
r(n, "requestInterceptors", []), r(n, "responseSuccessInterceptors", []), r(n, "responseErrorInterceptors", []);
let u = n;
class R {
  constructor(t, e) {
    r(this, "http");
    r(this, "pathname");
    r(this, "schema");
    this.http = u.getInstance(), this.pathname = t, this.schema = e;
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
class q {
  constructor(t, e) {
    r(this, "http");
    r(this, "pathname");
    r(this, "schema");
    this.http = u.getInstance(), this.pathname = t, this.schema = e;
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
class P {
  constructor(t, e) {
    r(this, "http");
    r(this, "pathname");
    r(this, "userSchema");
    r(this, "credentialsSchema");
    r(this, "registerDataSchema");
    r(this, "tokenSchema");
    this.http = u.getInstance(), this.pathname = t, this.userSchema = e.user, this.credentialsSchema = e.credentials, this.registerDataSchema = e.registerData, this.tokenSchema = e.tokens;
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
      }, e), a = this.userSchema.parse(s.user);
      return this.tokenSchema && this.tokenSchema.parse(s.tokens), a;
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
      }, e), a = this.userSchema.parse(s.user), i = this.tokenSchema ? this.tokenSchema.parse(s.tokens) : s.tokens;
      return { user: a, tokens: i };
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
  P as Auth,
  u as HttpClient,
  R as Mutation,
  q as Query
};
//# sourceMappingURL=index.es.js.map

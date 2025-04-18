var S = Object.defineProperty;
var T = (u, e, t) => e in u ? S(u, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[e] = t;
var n = (u, e, t) => T(u, typeof e != "symbol" ? e + "" : e, t);
class f extends Error {
  constructor(t, r) {
    const s = t instanceof Error ? t.message : "API Service Request Failed";
    super(s);
    n(this, "status");
    n(this, "statusText");
    n(this, "data");
    n(this, "originalError");
    n(this, "requestConfig");
    if (this.name = "ApiRequestError", this.originalError = t, this.requestConfig = r, t && typeof t == "object") {
      const a = t;
      if ("status" in a && (this.status = a.status), "statusText" in a && (this.statusText = a.statusText), "data" in a && (this.data = a.data), "response" in a && a.response instanceof Response) {
        const i = a.response;
        this.status = i.status, this.statusText = i.statusText;
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
    n(this, "baseURL");
    n(this, "defaultTimeout");
    n(this, "defaultHeaders");
    n(this, "withCredentials");
    n(this, "maxRetries");
    this.baseURL = "", this.defaultTimeout = 1e4, this.defaultHeaders = {}, this.withCredentials = !0, this.maxRetries = 3;
  }
  static init(e) {
    var s, a;
    const { httpConfig: t, instanceName: r } = e;
    if (c.requestInterceptors = [
      ...c.requestInterceptors,
      ...((s = t.interceptors) == null ? void 0 : s.request) ?? []
    ], (a = t.interceptors) != null && a.response && (c.responseSuccessInterceptors = [
      ...c.responseSuccessInterceptors,
      ...t.interceptors.response.success ?? []
    ], c.responseErrorInterceptors = [
      ...c.responseErrorInterceptors,
      ...t.interceptors.response.error ?? []
    ]), !this.instances.has(r)) {
      const i = new c();
      i.configure(t), this.instances.set(r, i), this.instances.size === 1 && (this.defaultInstanceName = r);
    }
    return this.instances.get(r);
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
      let r = e.apiPrefix.trim();
      return r.startsWith("/") || (r = "/" + r), r.endsWith("/") && (r = r.slice(0, -1)), t + r;
    }
    return e.apiVersion ? `${t}/v${e.apiVersion}` : t;
  }
  setupDefaultInterceptors() {
    c.responseErrorInterceptors.length === 0 && c.responseErrorInterceptors.push((e) => (this.logError(e), Promise.reject(e)));
  }
  logError(e) {
    var r, s;
    const t = {
      url: (r = e.config) == null ? void 0 : r.url,
      method: (s = e.config) == null ? void 0 : s.method,
      status: e.status,
      data: e.data,
      message: e.message
    };
    console.error("API Request Error", t);
  }
  async applyRequestInterceptors(e) {
    let t = { ...e };
    for (const r of c.requestInterceptors)
      t = await Promise.resolve(r(t));
    return t;
  }
  async applyResponseSuccessInterceptors(e) {
    let t = e;
    for (const r of c.responseSuccessInterceptors)
      t = await Promise.resolve(r(t.clone()));
    return t;
  }
  async applyResponseErrorInterceptors(e) {
    let t = e;
    for (const r of c.responseErrorInterceptors)
      try {
        if (t = await Promise.resolve(r(t)), !(t instanceof Error))
          return t;
      } catch (s) {
        t = s;
      }
    return Promise.reject(t);
  }
  isRetryableError(e, t) {
    return (!t || ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"].includes(t.toUpperCase())) && (e === 0 || e === 429 || e >= 500 && e < 600);
  }
  async fetchWithRetry(e, t, r = 1) {
    try {
      const { timeout: s = this.defaultTimeout, params: a, data: i, ...o } = t;
      let h = e;
      if (a && Object.keys(a).length > 0) {
        const d = new URLSearchParams();
        for (const [w, I] of Object.entries(a))
          d.append(w, I);
        h += `?${d.toString()}`;
      }
      const y = new AbortController(), R = setTimeout(() => y.abort("Request timeout"), s);
      let b;
      i !== void 0 && (b = typeof i == "string" ? i : JSON.stringify(i));
      const g = await fetch(h, {
        ...o,
        body: b,
        signal: y.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(R), !g.ok && r < this.maxRetries && this.isRetryableError(g.status, t.method)) {
        const d = Math.pow(2, r) * 100;
        return await new Promise((w) => setTimeout(w, d)), this.fetchWithRetry(e, t, r + 1);
      }
      return g;
    } catch (s) {
      if (s instanceof DOMException && s.name === "AbortError")
        throw new Error(`Request timeout after ${t.timeout || this.defaultTimeout}ms`);
      if (r < this.maxRetries && this.isRetryableError(0, t.method)) {
        const a = Math.pow(2, r) * 100;
        return await new Promise((i) => setTimeout(i, a)), this.fetchWithRetry(e, t, r + 1);
      }
      throw s;
    }
  }
  async request(e, t = {}) {
    var r;
    try {
      const s = {
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
        s.url.startsWith("http") ? s.url : `${this.baseURL}${s.url.startsWith("/") ? "" : "/"}${s.url}`
      ).toString(), i = await this.applyRequestInterceptors({
        ...s,
        url: a
      });
      let o = await this.fetchWithRetry(a, i);
      return o = await this.applyResponseSuccessInterceptors(o), (r = o.headers.get("content-type")) != null && r.includes("application/json") ? await o.json() : await o.text();
    } catch (s) {
      const a = s instanceof f ? s : new f(s, {
        ...e,
        ...t,
        url: e.url
      });
      return this.applyResponseErrorInterceptors(a);
    }
  }
};
n(c, "instances", /* @__PURE__ */ new Map()), n(c, "defaultInstanceName"), n(c, "requestInterceptors", []), n(c, "responseSuccessInterceptors", []), n(c, "responseErrorInterceptors", []);
let p = c;
class E {
  createRelation(e, t) {
    const r = {}, s = t ? { ...t } : {};
    Object.entries(e).forEach(([i, o]) => {
      o !== null && typeof o == "object" && "operation" in o && ["create", "update", "attach", "detach"].includes(o.operation) ? s[i] = o : r[i] = o;
    });
    const a = {
      operation: "create",
      attributes: r,
      ...Object.keys(s).length ? { relations: s } : {}
    };
    return Object.defineProperty(a, "__relationDefinition", {
      value: !0,
      enumerable: !1
    }), Object.keys(r).forEach(
      (i) => Object.defineProperty(a, i, {
        get: () => r[i],
        enumerable: !0
      })
    ), a;
  }
  updateRelation(e, t, r) {
    const s = {}, a = {};
    Object.entries(t).forEach(([o, h]) => {
      h !== null && typeof h == "object" && "operation" in h && h.operation === "create" || h.operation === "attach" ? a[o] = h : s[o] = h;
    });
    const i = {
      operation: "update",
      key: e,
      attributes: s,
      ...r || Object.keys(a).length ? { relations: r || a } : {}
    };
    return Object.defineProperty(i, "__relationDefinition", { value: !0, enumerable: !1 }), Object.keys(s).forEach(
      (o) => Object.defineProperty(i, o, {
        get: () => s[o],
        enumerable: !0
      })
    ), i;
  }
  // Les autres méthodes restent inchangées
  attach(e) {
    const t = {
      operation: "attach",
      key: e
    };
    return Object.defineProperty(t, "__relationDefinition", {
      value: !0,
      enumerable: !1,
      writable: !1,
      configurable: !0
    }), t;
  }
  detach(e) {
    const t = {
      operation: "detach",
      key: e
    };
    return Object.defineProperty(t, "__relationDefinition", {
      value: !0,
      enumerable: !1,
      writable: !1,
      configurable: !0
    }), t;
  }
  sync(e, t, r, s) {
    return {
      operation: "sync",
      key: e,
      without_detaching: s,
      ...t && { attributes: t },
      ...r && { pivot: r }
    };
  }
  toggle(e, t, r) {
    return {
      operation: "toggle",
      key: e,
      ...t && { attributes: t },
      ...r && { pivot: r }
    };
  }
}
class O extends E {
  constructor(t) {
    super();
    n(this, "operations", []);
    n(this, "mutationFn", null);
    n(this, "relationBuilder");
    this.relationBuilder = t;
  }
  setMutationFunction(t) {
    this.mutationFn = t;
  }
  createEntity(t) {
    const r = {}, s = {};
    for (const [i, o] of Object.entries(t))
      o && typeof o == "object" && "operation" in o ? s[i] = o : r[i] = o;
    const a = {
      operation: "create",
      attributes: r,
      relations: s
    };
    return this.operations.push(a), this;
  }
  updateEntity(t, r) {
    const s = {}, a = {};
    for (const [o, h] of Object.entries(r))
      h && typeof h == "object" && "operation" in h ? a[o] = h : s[o] = h;
    const i = {
      operation: "update",
      key: t,
      attributes: s,
      relations: a
    };
    return this.operations.push(i), this;
  }
  build() {
    const t = [...this.operations];
    return this.operations = [], { mutate: t };
  }
  async mutate(t) {
    if (!this.mutationFn)
      throw new Error("Mutation function not provided to builder");
    const r = this.build();
    return this.mutationFn(r, t);
  }
  createRelation(t, r) {
    return this.relationBuilder.createRelation(t, r);
  }
  updateRelation(t, r, s) {
    return this.relationBuilder.updateRelation(t, r, s);
  }
  attach(t) {
    return this.relationBuilder.attach(t);
  }
  detach(t) {
    return this.relationBuilder.detach(t);
  }
  sync(t, r, s, a) {
    return this.relationBuilder.sync(t, r, s, a);
  }
  toggle(t, r, s) {
    return this.relationBuilder.toggle(t, r, s);
  }
}
const l = class l {
  static getRelationBuilder() {
    return l.relationInstance || (l.relationInstance = new E()), l.relationInstance;
  }
  static createEntityBuilder(e) {
    return new O(e || l.getRelationBuilder());
  }
};
n(l, "relationInstance");
let m = l;
class q {
  constructor(e, t) {
    n(this, "http");
    n(this, "pathname");
    n(this, "schema");
    n(this, "relation");
    this.http = p.getInstance(), this.pathname = e, this.schema = t, this.relation = m.getRelationBuilder();
  }
  entityBuilder() {
    const e = m.createEntityBuilder(this.relation);
    return e.setMutationFunction((t, r) => this.mutate(t, r)), e;
  }
  relationBuilder() {
    return this.relation;
  }
  validateData(e) {
    return e.map((t) => {
      const r = this.schema.safeParse(t);
      if (!r.success)
        throw console.error("Type validation failed:", r.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(r.error.errors)}`
        );
      return r.data;
    });
  }
  async mutate(e, t) {
    const r = "build" in e ? e.build() : e;
    return await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: r
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
    const r = await this.http.request(
      {
        method: "DELETE",
        url: this.pathname,
        data: e
      },
      t
    );
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
  async forceDelete(e, t = {}) {
    const r = await this.http.request(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: e
      },
      t
    );
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
  async restore(e, t = {}) {
    const r = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: e
      },
      t
    );
    return {
      ...r,
      data: this.validateData(r.data)
    };
  }
}
class j {
  constructor(e, t) {
    n(this, "http");
    n(this, "pathname");
    n(this, "schema");
    this.http = p.getInstance(), this.pathname = e, this.schema = t;
  }
  validateData(e) {
    return e.map((t) => {
      const r = this.schema.safeParse(t);
      if (!r.success)
        throw console.error("Type validation failed:", r.error.errors), new Error(
          `Type validation failed: ${JSON.stringify(r.error.errors)}`
        );
      return r.data;
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
    const r = await this.searchRequest(e, t);
    return this.validateData(r.data);
  }
  async searchPaginate(e, t = {}) {
    const r = await this.searchRequest(e, t);
    return {
      ...r,
      data: this.validateData(r.data)
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
class D {
  constructor(e, t) {
    n(this, "http");
    n(this, "pathname");
    n(this, "userSchema");
    n(this, "credentialsSchema");
    n(this, "registerDataSchema");
    n(this, "tokenSchema");
    this.http = p.getInstance(), this.pathname = e, this.userSchema = t.user, this.credentialsSchema = t.credentials, this.registerDataSchema = t.registerData, this.tokenSchema = t.tokens;
  }
  /**
   * Inscription
   */
  async register(e, t = {}) {
    this.registerDataSchema && this.registerDataSchema.parse(e);
    try {
      const r = await this.http.request({
        method: "POST",
        url: `${this.pathname}/register`,
        data: e
      }, t), s = this.userSchema.parse(r.user);
      return this.tokenSchema && this.tokenSchema.parse(r.tokens), s;
    } catch (r) {
      throw console.error("Registration error", r), r;
    }
  }
  /**
   * Connexion
   */
  async login(e, t = {}) {
    this.credentialsSchema && this.credentialsSchema.parse(e);
    try {
      const r = await this.http.request({
        method: "POST",
        url: `${this.pathname}/login`,
        data: e
      }, t), s = this.userSchema.parse(r.user), a = this.tokenSchema ? this.tokenSchema.parse(r.tokens) : r.tokens;
      return { user: s, tokens: a };
    } catch (r) {
      throw console.error("Login error", r), r;
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
      const r = await this.http.request({
        method: "POST",
        url: `${this.pathname}/refresh-token`,
        data: { refreshToken: e }
      }, t);
      return this.tokenSchema ? this.tokenSchema.parse(r) : r;
    } catch (r) {
      throw console.error("Token refresh error", r), r;
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
  D as Auth,
  p as HttpClient,
  q as Mutation,
  j as Query
};
//# sourceMappingURL=index.es.js.map

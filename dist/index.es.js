var S = Object.defineProperty;
var T = (u, t, e) => t in u ? S(u, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : u[t] = e;
var i = (u, t, e) => T(u, typeof t != "symbol" ? t + "" : t, e);
class f extends Error {
  constructor(e, r) {
    const s = e instanceof Error ? e.message : "API Service Request Failed";
    super(s);
    i(this, "status");
    i(this, "statusText");
    i(this, "data");
    i(this, "originalError");
    i(this, "requestConfig");
    if (this.name = "ApiRequestError", this.originalError = e, this.requestConfig = r, e && typeof e == "object") {
      const a = e;
      if ("status" in a && (this.status = a.status), "statusText" in a && (this.statusText = a.statusText), "data" in a && (this.data = a.data), "response" in a && a.response instanceof Response) {
        const o = a.response;
        this.status = o.status, this.statusText = o.statusText;
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
const h = class h {
  constructor() {
    i(this, "baseURL");
    i(this, "defaultTimeout");
    i(this, "defaultHeaders");
    i(this, "withCredentials");
    i(this, "maxRetries");
    this.baseURL = "", this.defaultTimeout = 1e4, this.defaultHeaders = {}, this.withCredentials = !0, this.maxRetries = 3;
  }
  static init(t) {
    var s, a;
    const { httpConfig: e, instanceName: r } = t;
    if (h.requestInterceptors = [
      ...h.requestInterceptors,
      ...((s = e.interceptors) == null ? void 0 : s.request) ?? []
    ], (a = e.interceptors) != null && a.response && (h.responseSuccessInterceptors = [
      ...h.responseSuccessInterceptors,
      ...e.interceptors.response.success ?? []
    ], h.responseErrorInterceptors = [
      ...h.responseErrorInterceptors,
      ...e.interceptors.response.error ?? []
    ]), !this.instances.has(r)) {
      const o = new h();
      o.configure(e), this.instances.set(r, o), this.instances.size === 1 && (this.defaultInstanceName = r);
    }
    return this.instances.get(r);
  }
  static getInstance(t) {
    const e = t || this.defaultInstanceName;
    if (!this.instances.has(e))
      throw new Error(
        `Http instance '${e}' not initialized. Call Http.init() first.`
      );
    return this.instances.get(e);
  }
  static setDefaultInstance(t) {
    if (!this.instances.has(t))
      throw new Error(
        `Cannot set default: Http instance '${t}' not initialized.`
      );
    this.defaultInstanceName = t;
  }
  static getAvailableInstances() {
    return Array.from(this.instances.keys());
  }
  static resetInstance(t) {
    t ? (this.instances.delete(t), t === this.defaultInstanceName && this.instances.size > 0 && (this.defaultInstanceName = this.instances.keys().next().value ?? "default")) : (this.instances.clear(), this.defaultInstanceName = "default");
  }
  configure(t) {
    this.baseURL = this.getFullBaseUrl(t), this.defaultTimeout = t.timeout ?? 1e4, this.maxRetries = t.maxRetries ?? 3, this.withCredentials = t.withCredentials ?? !0, this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...t.headers
    }, this.setupDefaultInterceptors();
  }
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
  setupDefaultInterceptors() {
    h.responseErrorInterceptors.length === 0 && h.responseErrorInterceptors.push((t) => (this.logError(t), Promise.reject(t)));
  }
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
  async applyRequestInterceptors(t) {
    let e = { ...t };
    for (const r of h.requestInterceptors)
      e = await Promise.resolve(r(e));
    return e;
  }
  async applyResponseSuccessInterceptors(t) {
    let e = t;
    for (const r of h.responseSuccessInterceptors)
      e = await Promise.resolve(r(e.clone()));
    return e;
  }
  async applyResponseErrorInterceptors(t) {
    let e = t;
    for (const r of h.responseErrorInterceptors)
      try {
        if (e = await Promise.resolve(r(e)), !(e instanceof Error))
          return e;
      } catch (s) {
        e = s;
      }
    return Promise.reject(e);
  }
  isRetryableError(t, e) {
    return (!e || ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"].includes(e.toUpperCase())) && (t === 0 || t === 429 || t >= 500 && t < 600);
  }
  async fetchWithRetry(t, e, r = 1) {
    try {
      const { timeout: s = this.defaultTimeout, params: a, data: o, ...n } = e;
      let c = t;
      if (a && Object.keys(a).length > 0) {
        const d = new URLSearchParams();
        for (const [g, I] of Object.entries(a))
          d.append(g, I);
        c += `?${d.toString()}`;
      }
      const w = new AbortController(), R = setTimeout(() => w.abort("Request timeout"), s);
      let b;
      o !== void 0 && (b = typeof o == "string" ? o : JSON.stringify(o));
      const y = await fetch(c, {
        ...n,
        body: b,
        signal: w.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      if (clearTimeout(R), !y.ok && r < this.maxRetries && this.isRetryableError(y.status, e.method)) {
        const d = Math.pow(2, r) * 100;
        return await new Promise((g) => setTimeout(g, d)), this.fetchWithRetry(t, e, r + 1);
      }
      return y;
    } catch (s) {
      if (s instanceof DOMException && s.name === "AbortError")
        throw new Error(`Request timeout after ${e.timeout || this.defaultTimeout}ms`);
      if (r < this.maxRetries && this.isRetryableError(0, e.method)) {
        const a = Math.pow(2, r) * 100;
        return await new Promise((o) => setTimeout(o, a)), this.fetchWithRetry(t, e, r + 1);
      }
      throw s;
    }
  }
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
      }, a = new URL(
        s.url.startsWith("http") ? s.url : `${this.baseURL}${s.url.startsWith("/") ? "" : "/"}${s.url}`
      ).toString(), o = await this.applyRequestInterceptors({
        ...s,
        url: a
      });
      let n = await this.fetchWithRetry(a, o);
      return n = await this.applyResponseSuccessInterceptors(n), (r = n.headers.get("content-type")) != null && r.includes("application/json") ? await n.json() : await n.text();
    } catch (s) {
      const a = s instanceof f ? s : new f(s, {
        ...t,
        ...e,
        url: t.url
      });
      return this.applyResponseErrorInterceptors(a);
    }
  }
};
i(h, "instances", /* @__PURE__ */ new Map()), i(h, "defaultInstanceName"), i(h, "requestInterceptors", []), i(h, "responseSuccessInterceptors", []), i(h, "responseErrorInterceptors", []);
let p = h;
class E {
  createRelation(t, e) {
    const r = {}, s = {};
    if (!e && t && typeof t == "object")
      for (const [o, n] of Object.entries(t))
        n && typeof n == "object" && "operation" in n && (n.operation === "create" || n.operation === "attach") ? s[o] = n : r[o] = n;
    else if (t && typeof t == "object")
      for (const [o, n] of Object.entries(t))
        n && typeof n == "object" && "operation" in n || (r[o] = n);
    const a = {
      operation: "create",
      attributes: r,
      ...e ? { relations: e } : Object.keys(s).length > 0 ? { relations: s } : {}
    };
    if (Object.defineProperty(a, "__relationDefinition", {
      value: !0,
      enumerable: !1,
      writable: !1,
      configurable: !0
    }), t && typeof t == "object")
      for (const o of Object.keys(r))
        Object.defineProperty(a, o, {
          get() {
            return r[o];
          },
          enumerable: !0
        });
    return a;
  }
  updateRelation(t, e, r) {
    const s = {}, a = {};
    if (!r && e && typeof e == "object")
      for (const [n, c] of Object.entries(e))
        c && typeof c == "object" && "operation" in c && (c.operation === "create" || c.operation === "attach") ? a[n] = c : s[n] = c;
    else if (e && typeof e == "object")
      for (const [n, c] of Object.entries(e))
        c && typeof c == "object" && "operation" in c || (s[n] = c);
    const o = {
      operation: "update",
      key: t,
      attributes: s,
      ...r ? { relations: r } : Object.keys(a).length > 0 ? { relations: a } : {}
    };
    if (Object.defineProperty(o, "__relationDefinition", {
      value: !0,
      enumerable: !1,
      writable: !1,
      configurable: !0
    }), e && typeof e == "object")
      for (const n of Object.keys(s))
        Object.defineProperty(o, n, {
          get() {
            return s[n];
          },
          enumerable: !0
        });
    return o;
  }
  // Les autres méthodes restent inchangées
  attach(t) {
    const e = {
      operation: "attach",
      key: t
    };
    return Object.defineProperty(e, "__relationDefinition", {
      value: !0,
      enumerable: !1,
      writable: !1,
      configurable: !0
    }), e;
  }
  detach(t) {
    const e = {
      operation: "detach",
      key: t
    };
    return Object.defineProperty(e, "__relationDefinition", {
      value: !0,
      enumerable: !1,
      writable: !1,
      configurable: !0
    }), e;
  }
  sync(t, e, r, s) {
    return {
      operation: "sync",
      key: t,
      without_detaching: s,
      ...e && { attributes: e },
      ...r && { pivot: r }
    };
  }
  toggle(t, e, r) {
    return {
      operation: "toggle",
      key: t,
      ...e && { attributes: e },
      ...r && { pivot: r }
    };
  }
}
class j extends E {
  constructor(e) {
    super();
    i(this, "operations", []);
    i(this, "mutationFn", null);
    i(this, "relationBuilder");
    this.relationBuilder = e;
  }
  setMutationFunction(e) {
    this.mutationFn = e;
  }
  createEntity(e) {
    const r = {}, s = {};
    for (const [o, n] of Object.entries(e))
      n && typeof n == "object" && "operation" in n ? s[o] = n : r[o] = n;
    const a = {
      operation: "create",
      attributes: r,
      relations: s
    };
    return this.operations.push(a), this;
  }
  updateEntity(e, r) {
    const s = {}, a = {};
    for (const [n, c] of Object.entries(r))
      c && typeof c == "object" && "operation" in c ? a[n] = c : s[n] = c;
    const o = {
      operation: "update",
      key: e,
      attributes: s,
      relations: a
    };
    return this.operations.push(o), this;
  }
  build() {
    const e = [...this.operations];
    return this.operations = [], { mutate: e };
  }
  async mutate(e) {
    if (!this.mutationFn)
      throw new Error("Mutation function not provided to builder");
    const r = this.build();
    return this.mutationFn(r, e);
  }
  createRelation(e, r) {
    return this.relationBuilder.createRelation(e, r);
  }
  updateRelation(e, r, s) {
    return this.relationBuilder.updateRelation(e, r, s);
  }
  attach(e) {
    return this.relationBuilder.attach(e);
  }
  detach(e) {
    return this.relationBuilder.detach(e);
  }
  sync(e, r, s, a) {
    return this.relationBuilder.sync(e, r, s, a);
  }
  toggle(e, r, s) {
    return this.relationBuilder.toggle(e, r, s);
  }
}
const l = class l {
  static getRelationBuilder() {
    return l.relationInstance || (l.relationInstance = new E()), l.relationInstance;
  }
  static createEntityBuilder(t) {
    return new j(t || l.getRelationBuilder());
  }
};
i(l, "relationInstance");
let m = l;
class k {
  constructor(t, e) {
    i(this, "http");
    i(this, "pathname");
    i(this, "schema");
    i(this, "relation");
    this.http = p.getInstance(), this.pathname = t, this.schema = e, this.relation = m.getRelationBuilder();
  }
  entityBuilder() {
    const t = m.createEntityBuilder(this.relation);
    return t.setMutationFunction((e, r) => this.mutate(e, r)), t;
  }
  relationBuilder() {
    return this.relation;
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
    const r = "build" in t ? t.build() : t;
    return await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: r
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
    i(this, "http");
    i(this, "pathname");
    i(this, "schema");
    this.http = p.getInstance(), this.pathname = t, this.schema = e;
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
class v {
  constructor(t, e) {
    i(this, "http");
    i(this, "pathname");
    i(this, "userSchema");
    i(this, "credentialsSchema");
    i(this, "registerDataSchema");
    i(this, "tokenSchema");
    this.http = p.getInstance(), this.pathname = t, this.userSchema = e.user, this.credentialsSchema = e.credentials, this.registerDataSchema = e.registerData, this.tokenSchema = e.tokens;
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
      }, e), s = this.userSchema.parse(r.user), a = this.tokenSchema ? this.tokenSchema.parse(r.tokens) : r.tokens;
      return { user: s, tokens: a };
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
  v as Auth,
  p as HttpClient,
  k as Mutation,
  P as Query
};
//# sourceMappingURL=index.es.js.map

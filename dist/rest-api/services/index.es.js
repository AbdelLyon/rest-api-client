import w from "axios";
import a from "axios-retry";
var P = Object.defineProperty, x = (r, e, t) => e in r ? P(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, c = (r, e, t) => x(r, typeof e != "symbol" ? e + "" : e, t);
class m {
  constructor(e, t) {
    c(this, "axiosInstance"), c(this, "domain"), c(this, "baseUrl"), c(this, "MAX_RETRIES", 3), this.domain = e, this.baseUrl = t, this.axiosInstance = this.createAxiosInstance(), this.setupInterceptors(), this.configureRetry();
  }
  createAxiosInstance() {
    return w.create({
      baseURL: this.getFullBaseUrl(),
      timeout: 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      withCredentials: !0
    });
  }
  getFullBaseUrl() {
    return `https://local-${this.domain}-api.xefi-apps.fr/api/${this.baseUrl}`;
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (e) => e,
      (e) => Promise.reject(e)
    ), this.axiosInstance.interceptors.response.use(
      (e) => e,
      this.handleErrorResponse.bind(this)
    );
  }
  configureRetry() {
    a(this.axiosInstance, {
      retries: this.MAX_RETRIES,
      retryDelay: a.exponentialDelay,
      retryCondition: this.isRetryableError
    });
  }
  isRetryableError(e) {
    var t;
    return a.isNetworkOrIdempotentRequestError(e) || ((t = e.response) == null ? void 0 : t.status) === 429;
  }
  handleErrorResponse(e) {
    return Promise.reject(e);
  }
  setAxiosInstance(e) {
    this.axiosInstance = e;
  }
}
var E = Object.defineProperty, A = (r, e, t) => e in r ? E(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, o = (r, e, t) => A(r, typeof e != "symbol" ? e + "" : e, t);
class u extends Error {
  constructor(e, t) {
    super("API Service Request Failed"), this.originalError = e, this.requestConfig = t, this.name = "ApiServiceError";
  }
}
class n extends m {
  constructor(e, t) {
    super(e, t), this.domain = e, this.pathname = t, o(this, "DEFAULT_REQUEST_OPTIONS", {
      timeout: 1e4,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }), o(this, "successInterceptor", (s) => s), o(this, "errorInterceptor", (s) => {
      throw this.logError(s), new u(s, s.config || {});
    }), this.setupApiInterceptors();
  }
  setupApiInterceptors() {
    this.axiosInstance.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor
    );
  }
  logError(e) {
    var t, s, i, f;
    console.error("API Request Error", {
      url: (t = e.config) == null ? void 0 : t.url,
      method: (s = e.config) == null ? void 0 : s.method,
      status: (i = e.response) == null ? void 0 : i.status,
      data: (f = e.response) == null ? void 0 : f.data,
      message: e.message
    });
  }
  async request(e, t = {}) {
    try {
      const s = {
        ...this.DEFAULT_REQUEST_OPTIONS,
        ...e,
        ...t
      };
      return (await this.axiosInstance.request(
        s
      )).data;
    } catch (s) {
      throw s instanceof u ? s : new u(s, e);
    }
  }
  search(e, t = {}) {
    return this.request(
      {
        method: "POST",
        url: "/search",
        data: { search: e }
      },
      t
    );
  }
  mutate(e, t = {}) {
    return this.request(
      {
        method: "POST",
        url: "/mutate",
        data: { mutate: e }
      },
      t
    );
  }
  executeAction(e, t = {}) {
    return this.request(
      {
        method: "POST",
        url: `/actions/${e.action}`,
        data: e.params
      },
      t
    );
  }
  customRequest(e, t, s, i = {}) {
    return this.request({ method: e, url: t, data: s }, i);
  }
  _setAxiosInstanceForTesting(e) {
    this.axiosInstance = e;
  }
}
var R = Object.defineProperty, y = (r, e, t) => e in r ? R(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, F = (r, e, t) => y(r, e + "", t);
const d = class p extends n {
  constructor(e, t) {
    super(e, t);
  }
  static getInstance(e, t) {
    const s = `${e}:${t}`;
    return this.instances.has(s) || this.instances.set(s, new p(e, t)), this.instances.get(s) ?? new p(e, t);
  }
  static resetInstance(e, t) {
    if (e !== void 0 && e !== "" && t !== void 0 && t !== "") {
      const s = `${e}:${t}`;
      this.instances.delete(s);
    } else
      this.instances.clear();
  }
};
F(d, "instances", /* @__PURE__ */ new Map());
let G = d;
var O = Object.defineProperty, T = (r, e, t) => e in r ? O(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, b = (r, e, t) => T(r, e + "", t);
const _ = class l extends n {
  constructor(e, t) {
    super(e, t);
  }
  static getInstance(e, t) {
    const s = `${e}:${t}`;
    return this.instances.has(s) || this.instances.set(s, new l(e, t)), this.instances.get(s) ?? new l(e, t);
  }
  static resetInstance(e, t) {
    if (e !== void 0 && e !== "" && t !== void 0 && t !== "") {
      const s = `${e}:${t}`;
      this.instances.delete(s);
    } else
      this.instances.clear();
  }
};
b(_, "instances", /* @__PURE__ */ new Map());
let J = _;
var q = Object.defineProperty, C = (r, e, t) => e in r ? q(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, N = (r, e, t) => C(r, e + "", t);
const v = class $ extends n {
  constructor(e, t) {
    super(e, t);
  }
  static getInstance(e, t) {
    const s = `${e}:${t}`;
    this.instances.has(s) || this.instances.set(s, new $(e, t));
    const i = this.instances.get(s);
    if (!i)
      throw new Error(
        `Failed to get or create ClientService instance for ${s}`
      );
    return i;
  }
  static resetInstance(e, t) {
    if (typeof e == "string" && e !== "" && typeof t == "string" && t !== "") {
      const s = `${e}:${t}`;
      this.instances.delete(s);
    } else
      this.instances.clear();
  }
};
N(v, "instances", /* @__PURE__ */ new Map());
let K = v;
var M = Object.defineProperty, D = (r, e, t) => e in r ? M(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, L = (r, e, t) => D(r, e + "", t);
const I = class h extends n {
  constructor(e, t) {
    super(e, t);
  }
  static getInstance(e, t) {
    const s = `${e}:${t}`;
    return this.instances.has(s) || this.instances.set(s, new h(e, t)), this.instances.get(s) ?? new h(e, t);
  }
  static resetInstance(e, t) {
    if (e !== void 0 && e !== "" && t !== void 0 && t !== "") {
      const s = `${e}:${t}`;
      this.instances.delete(s);
    } else
      this.instances.clear();
  }
};
L(I, "instances", /* @__PURE__ */ new Map());
let V = I;
var B = Object.defineProperty, Q = (r, e, t) => e in r ? B(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, X = (r, e, t) => Q(r, e + "", t);
const g = class S extends n {
  constructor(e, t) {
    super(e, t);
  }
  static getInstance(e, t) {
    const s = `${e}:${t}`;
    this.instances.has(s) || this.instances.set(s, new S(e, t));
    const i = this.instances.get(s);
    if (!i)
      throw new Error(`Failed to get RoleService instance for ${s}`);
    return i;
  }
  static resetInstance(e, t) {
    if (e !== void 0 && e !== "" && t !== void 0 && t !== "") {
      const s = `${e}:${t}`;
      this.instances.delete(s);
    } else
      this.instances.clear();
  }
};
X(g, "instances", /* @__PURE__ */ new Map());
let W = g;
export {
  n as ApiService,
  J as ApplicationService,
  K as ClientService,
  m as HttpService,
  W as RoleService,
  V as SiteService,
  G as UserService
};

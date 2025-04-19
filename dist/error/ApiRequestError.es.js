var h = Object.defineProperty;
var c = (r, e, t) => e in r ? h(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var i = (r, e, t) => c(r, typeof e != "symbol" ? e + "" : e, t);
class u extends Error {
  constructor(t, n) {
    const o = t instanceof Error ? t.message : "API Service Request Failed";
    super(o);
    i(this, "status");
    i(this, "statusText");
    i(this, "data");
    i(this, "originalError");
    i(this, "requestConfig");
    if (this.name = "ApiRequestError", this.originalError = t, this.requestConfig = n, t && typeof t == "object") {
      const s = t;
      if ("status" in s && (this.status = s.status), "statusText" in s && (this.statusText = s.statusText), "data" in s && (this.data = s.data), "response" in s && s.response instanceof Response) {
        const a = s.response;
        this.status = a.status, this.statusText = a.statusText;
      }
    }
    Error.captureStackTrace && Error.captureStackTrace(this, u);
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
export {
  u as ApiRequestError
};

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class RequestError extends Error {
  constructor(error, requestConfig) {
    const message = error instanceof Error ? error.message : "API Service Request Failed";
    super(message);
    __publicField(this, "status");
    __publicField(this, "statusText");
    __publicField(this, "data");
    __publicField(this, "originalError");
    __publicField(this, "requestConfig");
    this.name = "ApiRequestError";
    this.originalError = error;
    this.requestConfig = requestConfig;
    if (error && typeof error === "object") {
      const errorObj = error;
      if ("status" in errorObj) {
        this.status = errorObj.status;
      }
      if ("statusText" in errorObj) {
        this.statusText = errorObj.statusText;
      }
      if ("data" in errorObj) {
        this.data = errorObj.data;
      }
      if ("response" in errorObj && errorObj.response instanceof Response) {
        const response = errorObj.response;
        this.status = response.status;
        this.statusText = response.statusText;
      }
    }
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
  RequestError
};
//# sourceMappingURL=RequestError.js.map

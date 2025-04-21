var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class HttpError extends Error {
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
    this.extractErrorDetails(error);
  }
  extractErrorDetails(error) {
    if (!error || typeof error !== "object") return;
    const errorSource = error;
    this.status = errorSource.status;
    this.statusText = errorSource.statusText;
    this.data = errorSource.data;
    if (errorSource.response instanceof Response) {
      const { response } = errorSource;
      this.status = response.status;
      this.statusText = response.statusText;
    }
  }
  getErrorType() {
    if (this.status === void 0 || this.status === 0) {
      return "network";
    } else if (this.status >= 400 && this.status < 500) {
      return "client";
    } else if (this.status >= 500) {
      return "server";
    }
    return "unknown";
  }
  hasStatus(status) {
    return this.status === status;
  }
}
export {
  HttpError
};
//# sourceMappingURL=HttpError.js.map

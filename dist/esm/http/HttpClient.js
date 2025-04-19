var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { HttpConfig } from "./HttpConfig.js";
import { HttpRequest } from "./HttpRequest.js";
import { Interceptor } from "./Interceptor.js";
import { ApiRequestError } from "../error/ApiRequestError.js";
class HttpClient {
  constructor() {
    __publicField(this, "baseURL");
    __publicField(this, "defaultTimeout");
    __publicField(this, "defaultHeaders");
    __publicField(this, "withCredentials");
    __publicField(this, "maxRetries");
    this.baseURL = "";
    this.defaultTimeout = 1e4;
    this.defaultHeaders = {};
    this.withCredentials = true;
    this.maxRetries = 3;
  }
  configure(options) {
    this.baseURL = HttpConfig.getFullBaseUrl(options);
    this.defaultTimeout = options.timeout ?? 1e4;
    this.maxRetries = options.maxRetries ?? 3;
    this.withCredentials = options.withCredentials ?? true;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers
    };
    Interceptor.setupDefaultErrorInterceptor(HttpConfig.logError);
    Interceptor.addInterceptors(options);
  }
  async request(config, options = {}) {
    var _a;
    try {
      const mergedConfig = {
        method: "GET",
        timeout: this.defaultTimeout,
        ...config,
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...config.headers || {},
          ...options.headers || {}
        }
      };
      const url = new URL(
        mergedConfig.url.startsWith("http") ? mergedConfig.url : `${this.baseURL}${mergedConfig.url.startsWith("/") ? "" : "/"}${mergedConfig.url}`
      ).toString();
      const interceptedConfig = await Interceptor.applyRequestInterceptors({
        ...mergedConfig,
        url
      });
      let response = await HttpRequest.fetchWithRetry(
        url,
        interceptedConfig,
        this.maxRetries,
        this.defaultTimeout,
        this.withCredentials
      );
      response = await Interceptor.applyResponseSuccessInterceptors(response);
      if ((_a = response.headers.get("content-type")) == null ? void 0 : _a.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      const apiError = error instanceof ApiRequestError ? error : new ApiRequestError(error, {
        ...config,
        ...options,
        url: config.url
      });
      return Interceptor.applyResponseErrorInterceptors(apiError);
    }
  }
}
export {
  HttpClient
};
//# sourceMappingURL=HttpClient.js.map

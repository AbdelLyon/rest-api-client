var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { HttpHandler } from "./HttpHandler.js";
import { HttpError } from "./HttpError.js";
import { HttpConfig } from "./HttpConfig.js";
import { HttpInterceptor } from "./HttpInterceptor.js";
class HttpRequest {
  constructor() {
    __publicField(this, "baseURL", "");
    __publicField(this, "defaultTimeout", 1e4);
    __publicField(this, "defaultHeaders", {});
    __publicField(this, "withCredentials", true);
    __publicField(this, "maxRetries", 3);
    __publicField(this, "handler");
    this.handler = new HttpHandler();
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
    this.handler.configure({
      baseURL: this.baseURL,
      defaultTimeout: this.defaultTimeout,
      defaultHeaders: this.defaultHeaders,
      maxRetries: this.maxRetries,
      withCredentials: this.withCredentials
    });
    HttpInterceptor.setupDefaultErrorInterceptor(HttpConfig.logError);
    HttpInterceptor.addInterceptors(options);
  }
  async request(config, options = {}) {
    try {
      const mergedConfig = this.createMergedConfig(config, options);
      const url = this.buildRequestUrl(mergedConfig.url);
      const interceptedConfig = await HttpInterceptor.applyRequestInterceptors({
        ...mergedConfig,
        url
      });
      const response = await this.handler.executeRequest(
        url,
        interceptedConfig
      );
      const interceptedResponse = await HttpInterceptor.applyResponseSuccessInterceptors(response);
      return await this.handler.parseResponse(interceptedResponse);
    } catch (error) {
      return this.handleReqError(error, config, options);
    }
  }
  createMergedConfig(config, options) {
    return {
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
  }
  buildRequestUrl(requestUrl) {
    if (requestUrl.startsWith("http")) {
      return requestUrl;
    }
    const prefix = requestUrl.startsWith("/") ? "" : "/";
    return new URL(`${this.baseURL}${prefix}${requestUrl}`).toString();
  }
  async handleReqError(error, config, options) {
    const apiError = error instanceof HttpError ? error : new HttpError(error, {
      ...config,
      ...options,
      url: config.url
    });
    throw await HttpInterceptor.applyResponseErrorInterceptors(apiError);
  }
}
export {
  HttpRequest
};
//# sourceMappingURL=HttpRequest.js.map

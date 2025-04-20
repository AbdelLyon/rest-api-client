var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { Config } from "./Config.js";
import { Interceptor } from "./Interceptor.js";
import { RequestError } from "./RequestError.js";
class Request {
  constructor() {
    __publicField(this, "baseURL", "");
    __publicField(this, "defaultTimeout", 1e4);
    __publicField(this, "defaultHeaders", {});
    __publicField(this, "withCredentials", true);
    __publicField(this, "maxRetries", 3);
  }
  configure(options) {
    this.baseURL = Config.getFullBaseUrl(options);
    this.defaultTimeout = options.timeout ?? 1e4;
    this.maxRetries = options.maxRetries ?? 3;
    this.withCredentials = options.withCredentials ?? true;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers
    };
    Interceptor.setupDefaultErrorInterceptor(Config.logError);
    Interceptor.addInterceptors(options);
  }
  async request(config, options = {}) {
    try {
      const mergedConfig = this.createMergedConfig(config, options);
      const url = this.buildRequestUrl(mergedConfig.url);
      const interceptedConfig = await this.applyRequestInterceptors(
        mergedConfig,
        url
      );
      let response = await this.executeRequest(url, interceptedConfig);
      response = await Interceptor.applyResponseSuccessInterceptors(response);
      return await this.parseResponse(response);
    } catch (error) {
      return this.handleRequestError(error, config, options);
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
  async applyRequestInterceptors(config, url) {
    return Interceptor.applyRequestInterceptors({
      ...config,
      url
    });
  }
  async executeRequest(url, config) {
    return this.fetchWithRetry(
      url,
      config,
      this.maxRetries,
      this.defaultTimeout,
      this.withCredentials
    );
  }
  async parseResponse(response) {
    var _a;
    if ((_a = response.headers.get("content-type")) == null ? void 0 : _a.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  }
  handleRequestError(error, config, options) {
    const apiError = error instanceof RequestError ? error : new RequestError(error, {
      ...config,
      ...options,
      url: config.url
    });
    return Interceptor.applyResponseErrorInterceptors(apiError);
  }
  isRetryableError(status, method) {
    const idempotentMethods = ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"];
    const isIdempotent = !method || idempotentMethods.includes(method.toUpperCase());
    return isIdempotent && (status === 0 || status === 429 || status >= 500 && status < 600);
  }
  async fetchWithRetry(url, config, maxRetries, defaultTimeout, withCredentials, attempt = 1) {
    try {
      const { response, timeoutId } = await this.performFetch(
        url,
        config,
        defaultTimeout,
        withCredentials
      );
      clearTimeout(timeoutId);
      if (!response.ok && this.shouldRetry(response.status, config.method, attempt, maxRetries)) {
        return this.retryWithBackoff(
          url,
          config,
          maxRetries,
          defaultTimeout,
          withCredentials,
          attempt
        );
      }
      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Request timeout after ${config.timeout || defaultTimeout}ms`
        );
      }
      if (attempt < maxRetries && this.isRetryableError(0, config.method)) {
        return this.retryWithBackoff(
          url,
          config,
          maxRetries,
          defaultTimeout,
          withCredentials,
          attempt
        );
      }
      throw error;
    }
  }
  async performFetch(url, config, defaultTimeout, withCredentials) {
    const { timeout = defaultTimeout, params, data, ...fetchOptions } = config;
    const fullUrl = this.appendQueryParams(url, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort("Request timeout"),
      timeout
    );
    const body = this.prepareRequestBody(data);
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      body,
      signal: controller.signal,
      credentials: withCredentials ? "include" : "same-origin"
    });
    return { response, timeoutId };
  }
  appendQueryParams(url, params) {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, value);
    }
    return `${url}?${queryParams.toString()}`;
  }
  prepareRequestBody(data) {
    if (data === void 0) {
      return void 0;
    }
    return typeof data === "string" ? data : JSON.stringify(data);
  }
  shouldRetry(status, method, attempt, maxRetries) {
    return attempt !== void 0 && maxRetries !== void 0 && attempt < maxRetries && this.isRetryableError(status, method);
  }
  async retryWithBackoff(url, config, maxRetries, defaultTimeout, withCredentials, attempt) {
    const delay = Math.pow(2, attempt) * 100;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return this.fetchWithRetry(
      url,
      config,
      maxRetries,
      defaultTimeout,
      withCredentials,
      attempt + 1
    );
  }
}
export {
  Request
};
//# sourceMappingURL=Request.js.map

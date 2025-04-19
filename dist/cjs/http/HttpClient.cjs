"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const ApiRequestError = require("../error/ApiRequestError.cjs");
const _HttpClient = class _HttpClient {
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
  static init(config) {
    var _a, _b;
    const { httpConfig, instanceName } = config;
    _HttpClient.requestInterceptors = [
      ..._HttpClient.requestInterceptors,
      ...((_a = httpConfig.interceptors) == null ? void 0 : _a.request) ?? []
    ];
    if ((_b = httpConfig.interceptors) == null ? void 0 : _b.response) {
      _HttpClient.responseSuccessInterceptors = [
        ..._HttpClient.responseSuccessInterceptors,
        ...httpConfig.interceptors.response.success ?? []
      ];
      _HttpClient.responseErrorInterceptors = [
        ..._HttpClient.responseErrorInterceptors,
        ...httpConfig.interceptors.response.error ?? []
      ];
    }
    if (!this.instances.has(instanceName)) {
      const instance = new _HttpClient();
      instance.configure(httpConfig);
      this.instances.set(instanceName, instance);
      if (this.instances.size === 1) {
        this.defaultInstanceName = instanceName;
      }
    }
    return this.instances.get(instanceName);
  }
  static getInstance(instanceName) {
    const name = instanceName || this.defaultInstanceName;
    if (!this.instances.has(name)) {
      throw new Error(
        `Http instance '${name}' not initialized. Call Http.init() first.`
      );
    }
    return this.instances.get(name);
  }
  static setDefaultInstance(instanceName) {
    if (!this.instances.has(instanceName)) {
      throw new Error(
        `Cannot set default: Http instance '${instanceName}' not initialized.`
      );
    }
    this.defaultInstanceName = instanceName;
  }
  static getAvailableInstances() {
    return Array.from(this.instances.keys());
  }
  static resetInstance(instanceName) {
    if (instanceName) {
      this.instances.delete(instanceName);
      if (instanceName === this.defaultInstanceName && this.instances.size > 0) {
        this.defaultInstanceName = this.instances.keys().next().value ?? "default";
      }
    } else {
      this.instances.clear();
      this.defaultInstanceName = "default";
    }
  }
  configure(options) {
    this.baseURL = this.getFullBaseUrl(options);
    this.defaultTimeout = options.timeout ?? 1e4;
    this.maxRetries = options.maxRetries ?? 3;
    this.withCredentials = options.withCredentials ?? true;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers
    };
    this.setupDefaultInterceptors();
  }
  getFullBaseUrl(options) {
    if (!options.baseURL) {
      throw new Error("baseURL is required in HttpConfigOptions");
    }
    let baseUrl = options.baseURL.trim();
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }
    if (options.apiPrefix) {
      let prefix = options.apiPrefix.trim();
      if (!prefix.startsWith("/")) {
        prefix = "/" + prefix;
      }
      if (prefix.endsWith("/")) {
        prefix = prefix.slice(0, -1);
      }
      return baseUrl + prefix;
    }
    if (options.apiVersion) {
      return `${baseUrl}/v${options.apiVersion}`;
    }
    return baseUrl;
  }
  setupDefaultInterceptors() {
    if (_HttpClient.responseErrorInterceptors.length === 0) {
      _HttpClient.responseErrorInterceptors.push((error) => {
        this.logError(error);
        return Promise.reject(error);
      });
    }
  }
  logError(error) {
    var _a, _b;
    const errorDetails = {
      url: (_a = error.config) == null ? void 0 : _a.url,
      method: (_b = error.config) == null ? void 0 : _b.method,
      status: error.status,
      data: error.data,
      message: error.message
    };
    console.error("API Request Error", errorDetails);
  }
  async applyRequestInterceptors(config) {
    let interceptedConfig = { ...config };
    for (const interceptor of _HttpClient.requestInterceptors) {
      interceptedConfig = await Promise.resolve(interceptor(interceptedConfig));
    }
    return interceptedConfig;
  }
  async applyResponseSuccessInterceptors(response) {
    let interceptedResponse = response;
    for (const interceptor of _HttpClient.responseSuccessInterceptors) {
      interceptedResponse = await Promise.resolve(interceptor(interceptedResponse.clone()));
    }
    return interceptedResponse;
  }
  async applyResponseErrorInterceptors(error) {
    let interceptedError = error;
    for (const interceptor of _HttpClient.responseErrorInterceptors) {
      try {
        interceptedError = await Promise.resolve(interceptor(interceptedError));
        if (!(interceptedError instanceof Error)) {
          return interceptedError;
        }
      } catch (e) {
        interceptedError = e;
      }
    }
    return Promise.reject(interceptedError);
  }
  isRetryableError(status, method) {
    const idempotentMethods = ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"];
    const isIdempotent = !method || idempotentMethods.includes(method.toUpperCase());
    return isIdempotent && (status === 0 || status === 429 || status >= 500 && status < 600);
  }
  async fetchWithRetry(url, config, attempt = 1) {
    try {
      const { timeout = this.defaultTimeout, params, data, ...fetchOptions } = config;
      let fullUrl = url;
      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          queryParams.append(key, value);
        }
        fullUrl += `?${queryParams.toString()}`;
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort("Request timeout"), timeout);
      let body = void 0;
      if (data !== void 0) {
        body = typeof data === "string" ? data : JSON.stringify(data);
      }
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        body,
        signal: controller.signal,
        credentials: this.withCredentials ? "include" : "same-origin"
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        if (attempt < this.maxRetries && this.isRetryableError(response.status, config.method)) {
          const delay = Math.pow(2, attempt) * 100;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.fetchWithRetry(url, config, attempt + 1);
        }
      }
      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(`Request timeout after ${config.timeout || this.defaultTimeout}ms`);
      }
      if (attempt < this.maxRetries && this.isRetryableError(0, config.method)) {
        const delay = Math.pow(2, attempt) * 100;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, config, attempt + 1);
      }
      throw error;
    }
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
      const interceptedConfig = await this.applyRequestInterceptors({
        ...mergedConfig,
        url
      });
      let response = await this.fetchWithRetry(url, interceptedConfig);
      response = await this.applyResponseSuccessInterceptors(response);
      if ((_a = response.headers.get("content-type")) == null ? void 0 : _a.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      const apiError = error instanceof ApiRequestError.ApiRequestError ? error : new ApiRequestError.ApiRequestError(error, {
        ...config,
        ...options,
        url: config.url
      });
      return this.applyResponseErrorInterceptors(apiError);
    }
  }
};
__publicField(_HttpClient, "instances", /* @__PURE__ */ new Map());
__publicField(_HttpClient, "defaultInstanceName");
__publicField(_HttpClient, "requestInterceptors", []);
__publicField(_HttpClient, "responseSuccessInterceptors", []);
__publicField(_HttpClient, "responseErrorInterceptors", []);
let HttpClient = _HttpClient;
exports.HttpClient = HttpClient;
//# sourceMappingURL=HttpClient.cjs.map

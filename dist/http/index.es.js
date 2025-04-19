var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
class ApiRequestError extends Error {
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
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiRequestError);
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
    var _a, _b, _c, _d, _e;
    const { httpConfig, instanceName } = config;
    _HttpClient.requestInterceptors = [
      ..._HttpClient.requestInterceptors,
      ...(_b = (_a = httpConfig.interceptors) == null ? void 0 : _a.request) != null ? _b : []
    ];
    if ((_c = httpConfig.interceptors) == null ? void 0 : _c.response) {
      _HttpClient.responseSuccessInterceptors = [
        ..._HttpClient.responseSuccessInterceptors,
        ...(_d = httpConfig.interceptors.response.success) != null ? _d : []
      ];
      _HttpClient.responseErrorInterceptors = [
        ..._HttpClient.responseErrorInterceptors,
        ...(_e = httpConfig.interceptors.response.error) != null ? _e : []
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
    var _a;
    if (instanceName) {
      this.instances.delete(instanceName);
      if (instanceName === this.defaultInstanceName && this.instances.size > 0) {
        this.defaultInstanceName = (_a = this.instances.keys().next().value) != null ? _a : "default";
      }
    } else {
      this.instances.clear();
      this.defaultInstanceName = "default";
    }
  }
  configure(options) {
    var _a, _b, _c;
    this.baseURL = this.getFullBaseUrl(options);
    this.defaultTimeout = (_a = options.timeout) != null ? _a : 1e4;
    this.maxRetries = (_b = options.maxRetries) != null ? _b : 3;
    this.withCredentials = (_c = options.withCredentials) != null ? _c : true;
    this.defaultHeaders = __spreadValues({
      "Content-Type": "application/json",
      "Accept": "application/json"
    }, options.headers);
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
  applyRequestInterceptors(config) {
    return __async(this, null, function* () {
      let interceptedConfig = __spreadValues({}, config);
      for (const interceptor of _HttpClient.requestInterceptors) {
        interceptedConfig = yield Promise.resolve(interceptor(interceptedConfig));
      }
      return interceptedConfig;
    });
  }
  applyResponseSuccessInterceptors(response) {
    return __async(this, null, function* () {
      let interceptedResponse = response;
      for (const interceptor of _HttpClient.responseSuccessInterceptors) {
        interceptedResponse = yield Promise.resolve(interceptor(interceptedResponse.clone()));
      }
      return interceptedResponse;
    });
  }
  applyResponseErrorInterceptors(error) {
    return __async(this, null, function* () {
      let interceptedError = error;
      for (const interceptor of _HttpClient.responseErrorInterceptors) {
        try {
          interceptedError = yield Promise.resolve(interceptor(interceptedError));
          if (!(interceptedError instanceof Error)) {
            return interceptedError;
          }
        } catch (e) {
          interceptedError = e;
        }
      }
      return Promise.reject(interceptedError);
    });
  }
  isRetryableError(status, method) {
    const idempotentMethods = ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"];
    const isIdempotent = !method || idempotentMethods.includes(method.toUpperCase());
    return isIdempotent && (status === 0 || status === 429 || status >= 500 && status < 600);
  }
  fetchWithRetry(url, config, attempt = 1) {
    return __async(this, null, function* () {
      try {
        const _a = config, { timeout = this.defaultTimeout, params, data } = _a, fetchOptions = __objRest(_a, ["timeout", "params", "data"]);
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
        const response = yield fetch(fullUrl, __spreadProps(__spreadValues({}, fetchOptions), {
          body,
          signal: controller.signal,
          credentials: this.withCredentials ? "include" : "same-origin"
        }));
        clearTimeout(timeoutId);
        if (!response.ok) {
          if (attempt < this.maxRetries && this.isRetryableError(response.status, config.method)) {
            const delay = Math.pow(2, attempt) * 100;
            yield new Promise((resolve) => setTimeout(resolve, delay));
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
          yield new Promise((resolve) => setTimeout(resolve, delay));
          return this.fetchWithRetry(url, config, attempt + 1);
        }
        throw error;
      }
    });
  }
  request(_0) {
    return __async(this, arguments, function* (config, options = {}) {
      var _a;
      try {
        const mergedConfig = __spreadProps(__spreadValues(__spreadValues({
          method: "GET",
          timeout: this.defaultTimeout
        }, config), options), {
          headers: __spreadValues(__spreadValues(__spreadValues({}, this.defaultHeaders), config.headers || {}), options.headers || {})
        });
        const url = new URL(
          mergedConfig.url.startsWith("http") ? mergedConfig.url : `${this.baseURL}${mergedConfig.url.startsWith("/") ? "" : "/"}${mergedConfig.url}`
        ).toString();
        const interceptedConfig = yield this.applyRequestInterceptors(__spreadProps(__spreadValues({}, mergedConfig), {
          url
        }));
        let response = yield this.fetchWithRetry(url, interceptedConfig);
        response = yield this.applyResponseSuccessInterceptors(response);
        if ((_a = response.headers.get("content-type")) == null ? void 0 : _a.includes("application/json")) {
          return yield response.json();
        } else {
          return yield response.text();
        }
      } catch (error) {
        const apiError = error instanceof ApiRequestError ? error : new ApiRequestError(error, __spreadProps(__spreadValues(__spreadValues({}, config), options), {
          url: config.url
        }));
        return this.applyResponseErrorInterceptors(apiError);
      }
    });
  }
};
__publicField(_HttpClient, "instances", /* @__PURE__ */ new Map());
__publicField(_HttpClient, "defaultInstanceName");
__publicField(_HttpClient, "requestInterceptors", []);
__publicField(_HttpClient, "responseSuccessInterceptors", []);
__publicField(_HttpClient, "responseErrorInterceptors", []);
let HttpClient = _HttpClient;
export {
  HttpClient
};

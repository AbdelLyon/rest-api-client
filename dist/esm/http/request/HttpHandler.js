var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class HttpHandler {
  constructor() {
    __publicField(this, "idempotentMethods", [
      "GET",
      "HEAD",
      "OPTIONS",
      "PUT",
      "DELETE"
    ]);
    __publicField(this, "maxRetries", 3);
    __publicField(this, "defaultTimeout", 1e4);
    __publicField(this, "withCredentials", true);
  }
  configure(config) {
    this.maxRetries = config.maxRetries;
    this.defaultTimeout = config.defaultTimeout;
    this.withCredentials = config.withCredentials;
  }
  async executeRequest(url, config) {
    return this.fetchWithRetry(url, config, {
      maxRetries: this.maxRetries,
      defaultTimeout: this.defaultTimeout,
      withCredentials: this.withCredentials,
      attempt: 1
    });
  }
  async parseResponse(response) {
    const contentType = response.headers.get("content-type");
    if (contentType == null ? void 0 : contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  }
  async fetchWithRetry(url, config, retryOptions) {
    const { maxRetries, attempt, defaultTimeout, withCredentials } = retryOptions;
    try {
      const { response, timeoutId } = await this.performFetch(
        url,
        config,
        defaultTimeout,
        withCredentials
      );
      clearTimeout(timeoutId);
      if (!response.ok && this.shouldRetry(response.status, config.method, attempt, maxRetries)) {
        return this.retryWithBackoff(url, config, {
          maxRetries,
          defaultTimeout,
          withCredentials,
          attempt
        });
      }
      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Request timeout after ${config.timeout || defaultTimeout}ms`
        );
      }
      if (attempt < maxRetries && this.isRetryableError(0, config.method)) {
        return this.retryWithBackoff(url, config, {
          maxRetries,
          defaultTimeout,
          withCredentials,
          attempt
        });
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
  prepareRequestBody(data) {
    if (data === void 0) {
      return void 0;
    }
    return typeof data === "string" ? data : JSON.stringify(data);
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
  isRetryableError(status, method) {
    const isIdempotent = !method || this.idempotentMethods.includes(method.toUpperCase());
    return isIdempotent && (status === 0 || status === 429 || status >= 500 && status < 600);
  }
  shouldRetry(status, method, attempt, maxRetries) {
    return attempt !== void 0 && maxRetries !== void 0 && attempt < maxRetries && this.isRetryableError(status, method);
  }
  async retryWithBackoff(url, config, retryOptions) {
    const { maxRetries, attempt, defaultTimeout, withCredentials } = retryOptions;
    const delay = Math.pow(2, attempt) * 100;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return this.fetchWithRetry(url, config, {
      maxRetries,
      defaultTimeout,
      withCredentials,
      attempt: attempt + 1
    });
  }
}
export {
  HttpHandler
};
//# sourceMappingURL=HttpHandler.js.map

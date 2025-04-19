class HttpRequest {
  static isRetryableError(status, method) {
    const idempotentMethods = ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"];
    const isIdempotent = !method || idempotentMethods.includes(method.toUpperCase());
    return isIdempotent && (status === 0 || status === 429 || status >= 500 && status < 600);
  }
  static async fetchWithRetry(url, config, maxRetries, defaultTimeout, withCredentials, attempt = 1) {
    try {
      const {
        timeout = defaultTimeout,
        params,
        data,
        ...fetchOptions
      } = config;
      let fullUrl = url;
      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          queryParams.append(key, value);
        }
        fullUrl += `?${queryParams.toString()}`;
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort("Request timeout"),
        timeout
      );
      let body = void 0;
      if (data !== void 0) {
        body = typeof data === "string" ? data : JSON.stringify(data);
      }
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        body,
        signal: controller.signal,
        credentials: withCredentials ? "include" : "same-origin"
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        if (attempt < maxRetries && this.isRetryableError(response.status, config.method)) {
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
      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Request timeout after ${config.timeout || defaultTimeout}ms`
        );
      }
      if (attempt < maxRetries && this.isRetryableError(0, config.method)) {
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
      throw error;
    }
  }
}
export {
  HttpRequest
};
//# sourceMappingURL=HttpRequest.js.map

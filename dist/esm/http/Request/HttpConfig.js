class HttpConfig {
  static getFullBaseUrl(options) {
    if (!options.baseURL) {
      throw new Error("baseURL is required in HttpConfigOptions");
    }
    const baseUrl = options.baseURL.trim().replace(/\/$/, "");
    if (options.apiPrefix) {
      const prefix = options.apiPrefix.trim().replace(/^(?!\/)/, "/").replace(/\/$/, "");
      return `${baseUrl}${prefix}`;
    }
    if (options.apiVersion) {
      return `${baseUrl}/v${options.apiVersion}`;
    }
    return baseUrl;
  }
  static logError(error) {
    const { config, status, data, message } = error;
    const errorDetails = {
      url: config == null ? void 0 : config.url,
      method: config == null ? void 0 : config.method,
      status,
      data,
      message
    };
    console.error("API Request Error:", errorDetails);
  }
}
export {
  HttpConfig
};
//# sourceMappingURL=HttpConfig.js.map

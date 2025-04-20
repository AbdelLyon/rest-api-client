class Config {
  static getFullBaseUrl(options) {
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
  static logError(error) {
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
}
export {
  Config
};
//# sourceMappingURL=Config.js.map

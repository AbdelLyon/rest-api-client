var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class Interceptor {
  static addInterceptors(httpConfig) {
    var _a, _b;
    this.requestInterceptors = [
      ...this.requestInterceptors,
      ...((_a = httpConfig.interceptors) == null ? void 0 : _a.request) ?? []
    ];
    if ((_b = httpConfig.interceptors) == null ? void 0 : _b.response) {
      this.responseSuccessInterceptors = [
        ...this.responseSuccessInterceptors,
        ...httpConfig.interceptors.response.success ?? []
      ];
      this.responseErrorInterceptors = [
        ...this.responseErrorInterceptors,
        ...httpConfig.interceptors.response.error ?? []
      ];
    }
  }
  static async applyRequestInterceptors(config) {
    let interceptedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      interceptedConfig = await Promise.resolve(interceptor(interceptedConfig));
    }
    return interceptedConfig;
  }
  static async applyResponseSuccessInterceptors(response) {
    let interceptedResponse = response;
    for (const interceptor of this.responseSuccessInterceptors) {
      interceptedResponse = await Promise.resolve(
        interceptor(interceptedResponse.clone())
      );
    }
    return interceptedResponse;
  }
  static async applyResponseErrorInterceptors(error) {
    let interceptedError = error;
    for (const interceptor of this.responseErrorInterceptors) {
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
  static setupDefaultErrorInterceptor(logCallback) {
    if (this.responseErrorInterceptors.length === 0) {
      this.responseErrorInterceptors.push((error) => {
        logCallback(error);
        return Promise.reject(error);
      });
    }
  }
}
__publicField(Interceptor, "requestInterceptors", []);
__publicField(Interceptor, "responseSuccessInterceptors", []);
__publicField(Interceptor, "responseErrorInterceptors", []);
export {
  Interceptor
};
//# sourceMappingURL=Interceptor.js.map

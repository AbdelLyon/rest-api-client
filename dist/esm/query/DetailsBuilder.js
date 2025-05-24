var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class DetailsBuilder {
  constructor(queryInstance) {
    __publicField(this, "queryInstance");
    __publicField(this, "requestOptions", {});
    this.queryInstance = queryInstance;
  }
  withHeaders(headers) {
    this.requestOptions.headers = {
      ...this.requestOptions.headers,
      ...headers
    };
    return this;
  }
  withHeader(name, value) {
    if (!this.requestOptions.headers) {
      this.requestOptions.headers = {};
    }
    this.requestOptions.headers[name] = value;
    return this;
  }
  withTimeout(timeout) {
    this.requestOptions.timeout = timeout;
    return this;
  }
  withField(field) {
    return this.withParam("fields", field);
  }
  withFields(...fields) {
    return this.withParam("fields", fields.join(","));
  }
  withInclude(relation) {
    return this.withParam("include", relation);
  }
  withIncludes(...relations) {
    return this.withParam("include", relations.join(","));
  }
  withParams(params) {
    const stringParams = {};
    Object.entries(params).forEach(([key, value]) => {
      stringParams[key] = String(value);
    });
    this.requestOptions.params = {
      ...this.requestOptions.params,
      ...stringParams
    };
    return this;
  }
  withParam(key, value) {
    if (!this.requestOptions.params) {
      this.requestOptions.params = {};
    }
    this.requestOptions.params[key] = String(value);
    return this;
  }
  withCredentials(credentials) {
    this.requestOptions.credentials = credentials;
    return this;
  }
  withSignal(signal) {
    this.requestOptions.signal = signal;
    return this;
  }
  withResponseType(type) {
    this.requestOptions.responseType = type;
    return this;
  }
  async details() {
    if (!this.queryInstance) {
      throw new Error(
        "No query instance provided to execute the details request"
      );
    }
    return await this.queryInstance.details(this.build());
  }
  build() {
    return this.requestOptions;
  }
}
export {
  DetailsBuilder
};
//# sourceMappingURL=DetailsBuilder.js.map

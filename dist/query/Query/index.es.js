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
import { HttpClient } from "../../http/HttpClient/index.es.js";
class Query {
  constructor(pathname, schema) {
    __publicField(this, "http");
    __publicField(this, "pathname");
    __publicField(this, "schema");
    this.http = HttpClient.getInstance();
    this.pathname = pathname;
    this.schema = schema;
  }
  validateData(data) {
    return data.map((item) => {
      const result = this.schema.safeParse(item);
      if (!result.success) {
        console.error("Type validation failed:", result.error.errors);
        throw new Error(
          `Type validation failed: ${JSON.stringify(result.error.errors)}`
        );
      }
      return result.data;
    });
  }
  searchRequest(search, options = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/search`,
        data: { search }
      },
      options
    );
  }
  search(_0) {
    return __async(this, arguments, function* (search, options = {}) {
      const response = yield this.searchRequest(search, options);
      return this.validateData(response.data);
    });
  }
  searchPaginate(_0) {
    return __async(this, arguments, function* (search, options = {}) {
      const response = yield this.searchRequest(search, options);
      return __spreadProps(__spreadValues({}, response), {
        data: this.validateData(response.data)
      });
    });
  }
  getdetails(options = {}) {
    return this.http.request(
      {
        method: "GET",
        url: this.pathname
      },
      options
    );
  }
}
export {
  Query
};

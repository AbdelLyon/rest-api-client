var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { HttpClient } from "../http/HttpClient.js";
class Query {
  constructor(pathname, schema, httpInstanceName) {
    __publicField(this, "http");
    __publicField(this, "pathname");
    __publicField(this, "schema");
    this.http = HttpClient.getInstance(httpInstanceName);
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
  async search(search, options = {}) {
    const response = await this.searchRequest(search, options);
    const validatedData = this.validateData(response.data);
    const isPaginated = "page" in search || "limit" in search;
    if (isPaginated) {
      return {
        ...response,
        data: validatedData
      };
    }
    return validatedData;
  }
  details(options = {}) {
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
//# sourceMappingURL=Query.js.map

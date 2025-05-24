var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { HttpClient } from "../http/HttpClient.js";
import { Builder } from "./builder/Builder.js";
import { Relation } from "./builder/Relation.js";
class Mutation {
  constructor(pathname, schema, httpInstanceName) {
    __publicField(this, "http");
    __publicField(this, "pathname");
    __publicField(this, "schema");
    __publicField(this, "_relation");
    this.http = HttpClient.getInstance(httpInstanceName);
    this.pathname = pathname;
    this.schema = schema;
    this._relation = Relation.getInstance();
    this._relation.setContext("update");
  }
  get model() {
    const builder = Builder.create();
    builder.setMutationFunction((data) => this.mutate(data));
    return builder;
  }
  get relation() {
    return this._relation;
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
  async mutate(mutateRequest) {
    const data = "build" in mutateRequest ? mutateRequest.build() : mutateRequest;
    const response = await this.http.request({
      method: "POST",
      url: `${this.pathname}/mutate`,
      data
    });
    return response;
  }
  action(actionRequest) {
    return this.http.request({
      method: "POST",
      url: `${this.pathname}/actions/${actionRequest.action}`,
      data: actionRequest.payload
    });
  }
  async delete(request) {
    const response = await this.http.request({
      method: "DELETE",
      url: this.pathname,
      data: request
    });
    return {
      ...response,
      data: this.validateData(response.data)
    };
  }
  async forceDelete(request) {
    const response = await this.http.request({
      method: "DELETE",
      url: `${this.pathname}/force`,
      data: request
    });
    return {
      ...response,
      data: this.validateData(response.data)
    };
  }
  async restore(request) {
    const response = await this.http.request({
      method: "POST",
      url: `${this.pathname}/restore`,
      data: request
    });
    return {
      ...response,
      data: this.validateData(response.data)
    };
  }
}
export {
  Mutation
};
//# sourceMappingURL=Mutation.js.map

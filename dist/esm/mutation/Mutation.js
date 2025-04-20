var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { Builder } from "./builder/Builder.js";
import { HttpClient } from "../http/HttpClient.js";
class Mutation {
  constructor(pathname, schema, httpInstanceName) {
    __publicField(this, "http");
    __publicField(this, "pathname");
    __publicField(this, "schema");
    __publicField(this, "relation");
    this.http = HttpClient.getInstance(httpInstanceName);
    this.pathname = pathname;
    this.schema = schema;
    this.relation = Builder.getRelation();
  }
  builderModel() {
    const builder = Builder.create(this.relation);
    builder.setMutationFunction((data, options) => this.mutate(data, options));
    return builder;
  }
  builderRelation() {
    return this.relation;
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
  async mutate(mutateRequest, options) {
    const data = "build" in mutateRequest ? mutateRequest.build() : mutateRequest;
    const response = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data
      },
      options
    );
    return response;
  }
  action(actionRequest, options = {}) {
    return this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/actions/${actionRequest.action}`,
        data: actionRequest.payload
      },
      options
    );
  }
  async delete(request, options = {}) {
    const response = await this.http.request(
      {
        method: "DELETE",
        url: this.pathname,
        data: request
      },
      options
    );
    return {
      ...response,
      data: this.validateData(response.data)
    };
  }
  async forceDelete(request, options = {}) {
    const response = await this.http.request(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: request
      },
      options
    );
    return {
      ...response,
      data: this.validateData(response.data)
    };
  }
  async restore(request, options = {}) {
    const response = await this.http.request(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: request
      },
      options
    );
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

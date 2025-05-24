var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class SearchBuilder {
  constructor() {
    __publicField(this, "searchRequest", {});
    __publicField(this, "queryInstance");
  }
  withText(value) {
    this.searchRequest.text = { value };
    return this;
  }
  withScope(name, parameters = []) {
    if (!this.searchRequest.scopes) {
      this.searchRequest.scopes = [];
    }
    this.searchRequest.scopes.push({ name, parameters });
    return this;
  }
  withFilter(field, operator, value, type) {
    if (!this.searchRequest.filters) {
      this.searchRequest.filters = [];
    }
    this.searchRequest.filters.push({
      field,
      operator,
      value,
      type
    });
    return this;
  }
  withNestedFilters(filters) {
    if (!this.searchRequest.filters) {
      this.searchRequest.filters = [];
    }
    this.searchRequest.filters.push({ nested: filters });
    return this;
  }
  withSort(field, direction = "asc") {
    if (!this.searchRequest.sorts) {
      this.searchRequest.sorts = [];
    }
    this.searchRequest.sorts.push({ field, direction });
    return this;
  }
  withSelect(field) {
    if (!this.searchRequest.selects) {
      this.searchRequest.selects = [];
    }
    this.searchRequest.selects.push({ field });
    return this;
  }
  withInclude(relation, options = {}) {
    if (!this.searchRequest.includes) {
      this.searchRequest.includes = [];
    }
    const include = {
      relation,
      ...options
    };
    this.searchRequest.includes.push(include);
    return this;
  }
  // Aggregations avec typage strict
  withAggregate(relation, type, field, filters) {
    if (!this.searchRequest.aggregates) {
      this.searchRequest.aggregates = [];
    }
    this.searchRequest.aggregates.push({ relation, type, field, filters });
    return this;
  }
  withInstruction(name, fields) {
    if (!this.searchRequest.instructions) {
      this.searchRequest.instructions = [];
    }
    this.searchRequest.instructions.push({ name, fields });
    return this;
  }
  withGate(permission) {
    if (!this.searchRequest.Gates) {
      this.searchRequest.Gates = [];
    }
    this.searchRequest.Gates.push(permission);
    return this;
  }
  withPagination(page, limit) {
    this.searchRequest.page = page;
    this.searchRequest.limit = limit;
    return this;
  }
  async search(options = {}) {
    if (!this.queryInstance) {
      throw new Error("No query instance provided to execute the search");
    }
    return await this.queryInstance.search(this.build(), options);
  }
  build() {
    return this.searchRequest;
  }
  setQueryInstance(instance) {
    return this.queryInstance = instance;
  }
}
export {
  SearchBuilder
};
//# sourceMappingURL=SearchBuilder.js.map

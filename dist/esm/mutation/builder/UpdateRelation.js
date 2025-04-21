class UpdateRelation {
  add(params) {
    const { attributes, relations = {} } = params;
    const relationDefinition = {
      operation: "create",
      attributes,
      relations
    };
    this.defineRelationDefinition(relationDefinition);
    return relationDefinition;
  }
  edit(params) {
    const { key, attributes, relations = {} } = params;
    const relationDefinition = {
      operation: "update",
      key,
      attributes,
      relations
    };
    this.defineRelationDefinition(relationDefinition);
    return relationDefinition;
  }
  attach(key) {
    const result = {
      operation: "attach",
      key
    };
    this.defineRelationDefinition(result);
    return result;
  }
  detach(key) {
    const result = {
      operation: "detach",
      key
    };
    this.defineRelationDefinition(result);
    return result;
  }
  sync(params) {
    const { key, attributes, pivot, withoutDetaching } = params;
    const result = {
      operation: "sync",
      key,
      without_detaching: withoutDetaching,
      ...attributes && { attributes },
      ...pivot && { pivot }
    };
    this.defineRelationDefinition(result);
    return result;
  }
  toggle(params) {
    const { key, attributes, pivot } = params;
    const result = {
      operation: "toggle",
      key,
      ...attributes && { attributes },
      ...pivot && { pivot }
    };
    this.defineRelationDefinition(result);
    return result;
  }
  defineRelationDefinition(result) {
    Object.defineProperty(result, "__relationDefinition", {
      value: true,
      enumerable: false,
      writable: false,
      configurable: true
    });
  }
}
export {
  UpdateRelation
};
//# sourceMappingURL=UpdateRelation.js.map

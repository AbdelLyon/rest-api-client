class CreationRelation {
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
  attach(key) {
    const result = {
      operation: "attach",
      key
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
  CreationRelation
};
//# sourceMappingURL=CreationRelation.js.map

class Relation {
  add(params) {
    const { attributes, relations } = params;
    const relationDefinition = {
      operation: "create",
      attributes,
      relations
    };
    this.defineRelationDefinition(relationDefinition);
    return relationDefinition;
  }
  edit(params) {
    const { key, attributes, relations } = params;
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
    return this.createSimpleOperation("attach", key);
  }
  detach(key) {
    return this.createSimpleOperation("detach", key);
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
  // Méthodes pour obtenir les contextes spécifiques
  getCreationContext() {
    return {
      add: this.add.bind(this),
      attach: this.attach.bind(this)
    };
  }
  getUpdateContext() {
    return this;
  }
  createSimpleOperation(operation, key) {
    const result = {
      operation,
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
  Relation
};
//# sourceMappingURL=Relation.js.map

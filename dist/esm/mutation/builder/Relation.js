class Relation {
  add(params) {
    const { attributes, relations } = params;
    const { normalAttributes, nestedRelations: extractedRelations } = this.extractNestedRelations(attributes);
    const allRelations = relations ? { ...extractedRelations, ...relations } : extractedRelations;
    const relationDefinition = {
      operation: "create",
      attributes: normalAttributes,
      ...Object.keys(allRelations).length > 0 ? { relations: allRelations } : {}
    };
    this.defineRelationDefinition(relationDefinition);
    this.addGetters(relationDefinition, normalAttributes);
    return relationDefinition;
  }
  edit(params) {
    const { key, attributes, relations } = params;
    const { normalAttributes, nestedRelations: extractedRelations } = this.extractNestedRelations(attributes);
    const allRelations = relations ? { ...extractedRelations, ...relations } : extractedRelations;
    const relationDefinition = {
      operation: "update",
      key,
      attributes: normalAttributes,
      ...Object.keys(allRelations).length > 0 ? { relations: allRelations } : {}
    };
    this.defineRelationDefinition(relationDefinition);
    this.addGetters(relationDefinition, normalAttributes);
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
  // Méthodes privées
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
  extractNestedRelations(attributes) {
    const normalAttributes = {};
    const nestedRelations = {};
    for (const [key, value] of Object.entries(attributes)) {
      if (value && typeof value === "object" && "operation" in value) {
        nestedRelations[key] = value;
      } else {
        normalAttributes[key] = value;
      }
    }
    return { normalAttributes, nestedRelations };
  }
  addGetters(relationDefinition, normalAttributes) {
    for (const key of Object.keys(normalAttributes)) {
      Object.defineProperty(relationDefinition, key, {
        get() {
          return normalAttributes[key];
        },
        enumerable: true
      });
    }
  }
}
export {
  Relation
};
//# sourceMappingURL=Relation.js.map

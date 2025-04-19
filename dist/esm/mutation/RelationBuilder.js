class RelationBuilder {
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
  createRelation(attributes, relations) {
    const { normalAttributes, nestedRelations: initialNestedRelations } = this.extractNestedRelations(attributes);
    const nestedRelations = relations ? { ...initialNestedRelations, ...relations } : initialNestedRelations;
    const relationDefinition = {
      operation: "create",
      attributes: normalAttributes,
      ...Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {}
    };
    this.defineRelationDefinition(relationDefinition);
    this.addGetters(relationDefinition, normalAttributes);
    return relationDefinition;
  }
  updateRelation(key, attributes, relations) {
    const { normalAttributes, nestedRelations: initialNestedRelations } = this.extractNestedRelations(attributes);
    const nestedRelations = relations ? { ...initialNestedRelations, ...relations } : initialNestedRelations;
    const relationDefinition = {
      operation: "update",
      key,
      attributes: normalAttributes,
      ...Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {}
    };
    this.defineRelationDefinition(relationDefinition);
    this.addGetters(relationDefinition, normalAttributes);
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
  sync(key, attributes, pivot, withoutDetaching) {
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
  toggle(key, attributes, pivot) {
    const result = {
      operation: "toggle",
      key,
      ...attributes && { attributes },
      ...pivot && { pivot }
    };
    this.defineRelationDefinition(result);
    return result;
  }
}
export {
  RelationBuilder
};
//# sourceMappingURL=RelationBuilder.js.map

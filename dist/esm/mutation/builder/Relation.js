var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const _Relation = class _Relation {
  constructor() {
    __publicField(this, "context", "update");
  }
  static getInstance() {
    if (!_Relation.instance) {
      _Relation.instance = new _Relation();
    }
    return _Relation.instance;
  }
  setContext(context) {
    this.context = context;
  }
  // Méthodes toujours disponibles
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
  // Méthodes disponibles uniquement en contexte de mise à jour
  edit(params) {
    this.checkUpdateContext("edit");
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
  detach(key) {
    this.checkUpdateContext("detach");
    const result = {
      operation: "detach",
      key
    };
    this.defineRelationDefinition(result);
    return result;
  }
  sync(params) {
    this.checkUpdateContext("sync");
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
    this.checkUpdateContext("toggle");
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
  // Méthode privée pour vérifier le contexte
  checkUpdateContext(methodName) {
    if (this.context === "create") {
      throw new Error(
        `Cannot use method '${methodName}' in creation context. Only 'add' and 'attach' methods are allowed.`
      );
    }
  }
  defineRelationDefinition(result) {
    Object.defineProperty(result, "__relationDefinition", {
      value: true,
      enumerable: false,
      writable: false,
      configurable: true
    });
  }
};
__publicField(_Relation, "instance", null);
let Relation = _Relation;
export {
  Relation
};
//# sourceMappingURL=Relation.js.map

import { Model } from "./Model.js";
import { Relation } from "./Relation.js";
class Builder {
  static getRelation() {
    return Relation.getInstance();
  }
  static create() {
    return new Model();
  }
}
export {
  Builder
};
//# sourceMappingURL=Builder.js.map

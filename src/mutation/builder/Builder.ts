import type { IModel, IRelation } from "../types";
import { Model } from "./Model";
import { Relation } from "./Relation";

export class Builder {
  public static getRelation(): IRelation {
    return Relation.getInstance();
  }

  public static create<T>(): IModel<T> {
    return new Model<T>();
  }
}

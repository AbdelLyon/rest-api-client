import type { IModel, IRelation } from "../types";
import { Model } from "./Model";
import { Relation } from "./Relation";

export class Builder {
  private static relationInstance: IRelation = new Relation();

  public static getRelation(): IRelation {
    return Builder.relationInstance;
  }

  public static create<T>(): IModel<T> {
    return new Model<T>();
  }
}

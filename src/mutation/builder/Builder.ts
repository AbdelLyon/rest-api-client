import { Model } from "./Model";
import { Relation } from "./Relation";
import type { IModel, IRelation } from "../types";

export class Builder {
  private static relationInstance: IRelation = new Relation();

  public static getRelation(): IRelation {
    return Builder.relationInstance;
  }

  public static create<T>(relation?: IRelation): IModel<T> {
    return new Model<T>(relation || Builder.getRelation());
  }
}

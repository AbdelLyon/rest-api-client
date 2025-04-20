import { IModel, IRelation } from "../types.js";
export declare class Builder {
  private static relationInstance;
  static getRelation(): IRelation;
  static create<T>(relation?: IRelation): IModel<T>;
}

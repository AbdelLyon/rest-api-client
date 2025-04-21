import { IModel, IRelation } from "../types.js";
export declare class Builder {
  static getRelation(): IRelation;
  static create<T>(): IModel<T>;
}

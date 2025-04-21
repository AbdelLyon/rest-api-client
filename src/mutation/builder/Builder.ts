import type { IModel } from "../types";
import { Model } from "./Model";

export class Builder {
  public static create<T>(): IModel<T> {
    return new Model<T>();
  }
}

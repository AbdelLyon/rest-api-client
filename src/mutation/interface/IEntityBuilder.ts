import { BuildOnly, MutationFunction, MutationRequest, ValidCreateRelationOnly } from "@/mutation/types/mutation";

export interface IEntityBuilder<TModel> {
   createEntity<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
      attributes: { [K in keyof T]: K extends RelationKeys ? ValidCreateRelationOnly<T[K]> : T[K] }
   ): BuildOnly<TModel, Pick<T, Extract<RelationKeys, string>>>;

   updateEntity<T extends Record<string, unknown>>(
      key: string | number,
      attributes: T
   ): IEntityBuilder<TModel>;

   build(): MutationRequest<TModel>;

   setMutationFunction(cb: MutationFunction): void;
}
import type { IRelationBuilder } from "@/mutation/interface/IRelationBuilder";
import type { IEntityBuilder } from "@/mutation/interface/IEntityBuilder";
import { EntityBuilder } from "@/mutation/EntityBuilder";
import { RelationBuilder } from "@/mutation/RelationBuilder";

export class Builder {

   private static relationInstance: IRelationBuilder = new RelationBuilder();

   public static getRelationBuilder(): IRelationBuilder {
      return Builder.relationInstance;
   }

   public static createEntityBuilder<T>(relationBuilder?: IRelationBuilder): IEntityBuilder<T> {
      return new EntityBuilder<T>(relationBuilder || Builder.getRelationBuilder());
   }
}
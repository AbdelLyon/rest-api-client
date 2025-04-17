
/**
 * Types d'opérations de relation
 */
type RelationDefinitionType =
   | "create"
   | "update"
   | "attach"
   | "detach"
   | "sync"
   | "toggle";

/**
 * Interface de base pour une définition de relation
 */
interface BaseRelationDefinition {
   operation: RelationDefinitionType;
}

/**
 * Interface pour une relation de type "attach"
 */
interface AttachRelationDefinition extends BaseRelationDefinition {
   operation: "attach";
   key: string | number;
}

/**
 * Interface pour une relation de type "detach"
 */
interface DetachRelationDefinition extends BaseRelationDefinition {
   operation: "detach";
   key: string | number;
}

/**
 * Interface pour une relation de type "create"
 */
interface CreateRelationDefinitionBase<T> extends BaseRelationDefinition {
   operation: "create";
   attributes: T;
}

/**
 * Interface pour une relation de type "update"
 */
interface UpdateRelationDefinitionBase<T> extends BaseRelationDefinition {
   operation: "update";
   key: string | number;
   attributes: T;
}

/**
 * Interface pour une relation de type "sync"
 */
interface SyncRelationDefinition<T> extends BaseRelationDefinition {
   operation: "sync";
   without_detaching?: boolean;
   key: string | number | Array<string | number>;
   attributes?: T;
   pivot?: Record<string, string | number>;
}

/**
 * Interface pour une relation de type "toggle"
 */
interface ToggleRelationDefinition<T> extends BaseRelationDefinition {
   operation: "toggle";
   key: string | number | Array<string | number>;
   attributes?: T;
   pivot?: Record<string, string | number>;
}

/**
 * Extrait les attributs d'un modèle (tout sauf les relations)
 */
type ExtractModelAttributes<T> = Omit<T, 'relations'>;

/**
 * Interface générique pour une opération de mutation
 */
interface MutationOperation<TAttributes> {
   operation: "create" | "update";
   attributes: TAttributes;
   relations?: Record<string, any>;
   key?: string | number;
}




/**
 * Builder intelligent pour les requêtes de mutation et les opérations de relation
 */
export class Builder<TModel> {
   private static instance: Builder<unknown>;
   private mutate: Array<MutationOperation<ExtractModelAttributes<TModel>>> = [];
   /**
    * Récupère l'instance unique du Builder (pattern Singleton)
    */
   public static getInstance<T>(): Builder<T> {
      if (!Builder.instance) {
         Builder.instance = new Builder<T>();
      }
      return Builder.instance as Builder<T>;
   }

   /**
    * Crée une nouvelle instance du Builder
    */
   public createBuilder<T>(): Builder<T> {
      return new Builder<T>();
   }

   /**
    * Ajoute une opération de création à la requête
    * @param attributes Attributs de l'objet à créer
    * @param relations Relations à associer à l'objet créé
    */
   public createEntity(
      attributes: ExtractModelAttributes<TModel>,
      relations?: Record<string, any>
   ): this {
      const operation: MutationOperation<ExtractModelAttributes<TModel>> = {
         operation: "create",
         attributes,
         ...(relations && { relations })
      };

      this.mutate.push(operation);
      return this;
   }

   /**
    * Ajoute une opération de mise à jour à la requête
    * @param key ID de l'objet à mettre à jour
    * @param attributes Attributs à mettre à jour
    * @param relations Relations à mettre à jour
    */
   public update(
      key: string | number,
      attributes: Partial<ExtractModelAttributes<TModel>>,
      relations?: Record<string, any>
   ): this {
      const operation: MutationOperation<ExtractModelAttributes<TModel>> = {
         operation: "update",
         key,
         attributes: attributes as ExtractModelAttributes<TModel>,
         ...(relations && { relations })
      };

      this.mutate.push(operation);
      return this;
   }

   /**
    * Construit et retourne l'objet de requête final
    */
   public build(): Array<MutationOperation<ExtractModelAttributes<TModel>>> {
      return this.mutate;
   }

   // Méthodes de l'ancienne classe RelationBuilder

   /**
    * Crée une définition de relation de type "create"
    */
   public createRelation<T>(
      attributes: T,
      nestedRelations?: Record<string, any>
   ): CreateRelationDefinitionBase<T> & {
      relations?: typeof nestedRelations;
   } {
      return {
         operation: "create",
         attributes,
         ...(nestedRelations && { relations: nestedRelations })
      };
   }

   /**
    * Crée une définition de relation de type "update"
    */
   public updateRelation<T>(
      key: string | number,
      attributes: T,
      nestedRelations?: Record<string, any>
   ): UpdateRelationDefinitionBase<T> & {
      relations?: typeof nestedRelations;
   } {
      return {
         operation: "update",
         key,
         attributes,
         ...(nestedRelations && { relations: nestedRelations })
      };
   }

   /**
    * Crée une définition de relation de type "attach"
    */
   public attach(key: string | number): AttachRelationDefinition {
      return {
         operation: "attach",
         key
      };
   }

   /**
    * Crée une définition de relation de type "detach"
    */
   public detach(key: string | number): DetachRelationDefinition {
      return {
         operation: "detach",
         key
      };
   }

   /**
    * Crée une définition de relation de type "sync"
    */
   public sync<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>,
      withoutDetaching?: boolean
   ): SyncRelationDefinition<T> {
      return {
         operation: "sync",
         key,
         without_detaching: withoutDetaching,
         ...(attributes && { attributes }),
         ...(pivot && { pivot })
      };
   }

   /**
    * Crée une définition de relation de type "toggle"
    */
   public toggle<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>
   ): ToggleRelationDefinition<T> {
      return {
         operation: "toggle",
         key,
         ...(attributes && { attributes }),
         ...(pivot && { pivot })
      };
   }
}


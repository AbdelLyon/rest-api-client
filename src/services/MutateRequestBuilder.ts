type ExtractModelAttributes<T> = Omit<T, 'relations'>;

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
 * Définition des relations possibles en contexte de création
 */
type CreateRelationDefinitions<T> =
   | (CreateRelationDefinitionBase<T> & { relations?: Record<string, CreateRelationDefinitions<any>>; })
   | AttachRelationDefinition;

/**
 * Définition des relations possibles en contexte de mise à jour
 */
type UpdateRelationDefinitions<T> =
   | (CreateRelationDefinitionBase<T> & { relations?: Record<string, UpdateRelationDefinitions<any>>; })
   | (UpdateRelationDefinitionBase<T> & { relations?: Record<string, UpdateRelationDefinitions<any>>; })
   | AttachRelationDefinition
   | DetachRelationDefinition
   | SyncRelationDefinition<T>
   | ToggleRelationDefinition<T>;

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
   private inUpdateContext: boolean = false;

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
   public static createBuilder<T>(): Builder<T> {
      return new Builder<T>();
   }

   /**
    * Ajoute une opération de création à la requête
    * @param attributes Attributs de l'objet à créer
    * @param relations Relations à associer à l'objet créé (seulement create et attach autorisés)
    */
   public createEntity<R extends Record<string, CreateRelationDefinitions<any>>>(
      attributes: ExtractModelAttributes<TModel>,
      relations?: R
   ): this {
      this.inUpdateContext = false;

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
    * @param relations Relations à mettre à jour (toutes les opérations autorisées)
    */
   public update<R extends Record<string, UpdateRelationDefinitions<any>>>(
      key: string | number,
      attributes: Partial<ExtractModelAttributes<TModel>>,
      relations?: R
   ): this {
      this.inUpdateContext = true;

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

   // Méthodes pour la construction des opérations de relation

   /**
    * Crée une définition de relation de type "create" (disponible dans tous les contextes)
    */
   public createRelation<T>(
      attributes: T,
      nestedRelations?: Record<string, CreateRelationDefinitions<any> | UpdateRelationDefinitions<any>>
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
    * Méthode d'aide pour créer une opération de création (pour les relations imbriquées)
    */
   public addCreateOperation<T>(
      attributes: T,
      nestedRelations?: Record<string, CreateRelationDefinitions<any> | UpdateRelationDefinitions<any>>
   ): CreateRelationDefinitionBase<T> & {
      relations?: typeof nestedRelations;
   } {
      return this.createRelation(attributes, nestedRelations);
   }

   /**
    * Crée une définition de relation de type "update" (seulement disponible en contexte de mise à jour)
    */
   public updateRelation<T>(
      key: string | number,
      attributes: T,
      nestedRelations?: Record<string, UpdateRelationDefinitions<any>>
   ): UpdateRelationDefinitionBase<T> & {
      relations?: typeof nestedRelations;
   } {
      if (!this.inUpdateContext) {
         throw new Error("Cannot update a relation in create context. The entity doesn't exist yet.");
      }

      return {
         operation: "update",
         key,
         attributes,
         ...(nestedRelations && { relations: nestedRelations })
      };
   }

   /**
    * Crée une définition de relation de type "attach" (disponible dans tous les contextes)
    */
   public attach(key: string | number): AttachRelationDefinition {
      return {
         operation: "attach",
         key
      };
   }

   /**
    * Crée une définition de relation de type "detach" (seulement disponible en contexte de mise à jour)
    */
   public detach(key: string | number): DetachRelationDefinition {
      if (!this.inUpdateContext) {
         throw new Error("Cannot detach a relation in create context. The entity doesn't exist yet.");
      }

      return {
         operation: "detach",
         key
      };
   }

   /**
    * Crée une définition de relation de type "sync" (seulement disponible en contexte de mise à jour)
    */
   public sync<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>,
      withoutDetaching?: boolean
   ): SyncRelationDefinition<T> {
      if (!this.inUpdateContext) {
         throw new Error("Cannot sync relations in create context. The entity doesn't exist yet.");
      }

      return {
         operation: "sync",
         key,
         without_detaching: withoutDetaching,
         ...(attributes && { attributes }),
         ...(pivot && { pivot })
      };
   }

   /**
    * Crée une définition de relation de type "toggle" (seulement disponible en contexte de mise à jour)
    */
   public toggle<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>
   ): ToggleRelationDefinition<T> {
      if (!this.inUpdateContext) {
         throw new Error("Cannot toggle relations in create context. The entity doesn't exist yet.");
      }

      return {
         operation: "toggle",
         key,
         ...(attributes && { attributes }),
         ...(pivot && { pivot })
      };
   }
}


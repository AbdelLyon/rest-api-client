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
 * Définit les types de relations autorisés selon le contexte (création ou mise à jour)
 */
type RelationDefinition<T, InCreateContext extends boolean = false> =
   InCreateContext extends true
   ? (CreateRelationDefinitionBase<T> & {
      relations?: { [key: string]: RelationDefinition<any, true>; };
   }) | AttachRelationDefinition
   : (CreateRelationDefinitionBase<T> & {
      relations?: { [key: string]: RelationDefinition<any, false>; };
   }) | (UpdateRelationDefinitionBase<T> & {
      relations?: { [key: string]: RelationDefinition<any, false>; };
   }) | AttachRelationDefinition | DetachRelationDefinition | SyncRelationDefinition<T> | ToggleRelationDefinition<T>;

/**
 * Interface pour les données de mutation incluant les attributs et les relations
 */
interface MutationData<
   TAttributes,
   TRelations,
   InCreateContext extends boolean
> {
   attributes: TAttributes;
   relations?: {
      [K in keyof TRelations]: TRelations[K] extends RelationDefinition<infer T, any>
      ? RelationDefinition<T, InCreateContext>
      : never
   };
};

/**
 * Interface pour une opération de création
 */
interface CreateMutationOperation<
   TAttributes,
   TRelations
> extends MutationData<TAttributes, TRelations, true> {
   operation: "create";
};

/**
 * Interface pour une opération de mise à jour
 */
interface UpdateMutationOperation<
   TAttributes,
   TRelations
> extends MutationData<TAttributes, TRelations, false> {
   operation: "update";
   key: string | number;
};

/**
 * Type pour une opération de mutation (création ou mise à jour)
 */
type MutationOperation<
   TAttributes,
   TRelations
> = CreateMutationOperation<TAttributes, TRelations> | UpdateMutationOperation<TAttributes, TRelations>;

/**
 * Interface pour la requête de mutation
 */
interface MutationRequest<
   TAttributes,
   TRelations
> {
   mutate: Array<MutationOperation<TAttributes, TRelations>>;
};

/**
 * Interface pour la réponse de mutation
 */

/**
 * Helper pour la génération des définitions de relations en fonction du contexte
 */
export class RelationBuilder {
   /**
    * Crée une définition de relation de type "create" (valide dans tous les contextes)
    */
   public static createRelation<T>(
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
    * Crée une définition de relation de type "update" (valide uniquement en contexte de mise à jour)
    */
   public static updateRelation<T>(
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
    * Crée une définition de relation de type "attach" (valide dans tous les contextes)
    */
   public static attach(key: string | number): AttachRelationDefinition {
      return {
         operation: "attach",
         key
      };
   }

   /**
    * Crée une définition de relation de type "detach" (valide uniquement en contexte de mise à jour)
    */
   public static detach(key: string | number): DetachRelationDefinition {
      return {
         operation: "detach",
         key
      };
   }

   /**
    * Crée une définition de relation de type "sync" (valide uniquement en contexte de mise à jour)
    */
   public static sync<T>(
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
    * Crée une définition de relation de type "toggle" (valide uniquement en contexte de mise à jour)
    */
   public static toggle<T>(
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

/**
 * Builder pour la création d'entités avec des relations
 */
export class CreateEntityBuilder<TModel, TRelations = any> {
   private attributes: ExtractModelAttributes<TModel>;
   private relations?: Record<string, RelationDefinition<any, true>>;

   constructor (attributes: ExtractModelAttributes<TModel>) {
      this.attributes = attributes;
   }

   /**
    * Ajoute une relation à l'entité
    * Dans le contexte de création, seules les opérations "create" et "attach" sont autorisées
    */
   public withRelation<K extends keyof TRelations, T>(
      relationName: K & string,
      relation: RelationDefinition<T, true>
   ): this {
      if (!this.relations) {
         this.relations = {};
      }
      this.relations[relationName] = relation;
      return this;
   }

   /**
    * Finalise la construction de l'opération de création
    */
   public build(): CreateMutationOperation<ExtractModelAttributes<TModel>, TRelations> {
      return {
         operation: "create",
         attributes: this.attributes,
         ...(this.relations && { relations: this.relations as any })
      };
   }
}

/**
 * Builder pour la mise à jour d'entités avec des relations
 */
export class UpdateEntityBuilder<TModel, TRelations = any> {
   private key: string | number;
   private attributes: Partial<ExtractModelAttributes<TModel>>;
   private relations?: Record<string, RelationDefinition<any, false>>;

   constructor (key: string | number, attributes: Partial<ExtractModelAttributes<TModel>>) {
      this.key = key;
      this.attributes = attributes;
   }

   /**
    * Ajoute une relation à l'entité
    * Dans le contexte de mise à jour, toutes les opérations sont autorisées
    */
   public withRelation<K extends keyof TRelations, T>(
      relationName: K & string,
      relation: RelationDefinition<T, false>
   ): this {
      if (!this.relations) {
         this.relations = {};
      }
      this.relations[relationName] = relation;
      return this;
   }

   /**
    * Finalise la construction de l'opération de mise à jour
    */
   public build(): UpdateMutationOperation<Partial<ExtractModelAttributes<TModel>>, TRelations> {
      return {
         operation: "update",
         key: this.key,
         attributes: this.attributes,
         ...(this.relations && { relations: this.relations as any })
      };
   }
}

/**
 * Builder principal pour les opérations de mutation
 */
export class Builder<TModel, TRelations = any> {
   private mutate: Array<MutationOperation<ExtractModelAttributes<TModel> | Partial<ExtractModelAttributes<TModel>>, TRelations>> = [];

   /**
    * Crée une nouvelle instance du Builder
    */
   public static createBuilder<T, R = any>(): Builder<T, R> {
      return new Builder<T, R>();
   }

   /**
    * Commence la construction d'une opération de création
    */
   public createEntity(attributes: ExtractModelAttributes<TModel>): CreateEntityBuilder<TModel, TRelations> {
      const builder = new CreateEntityBuilder<TModel, TRelations>(attributes);
      this.mutate.push(builder.build());
      return builder;
   }

   /**
    * Commence la construction d'une opération de mise à jour
    */
   public updateEntity(key: string | number, attributes: Partial<ExtractModelAttributes<TModel>>): UpdateEntityBuilder<TModel, TRelations> {
      const builder = new UpdateEntityBuilder<TModel, TRelations>(key, attributes);
      this.mutate.push(builder.build());
      return builder;
   }

   /**
    * Ajoute une opération de création déjà construite
    */
   public addCreateOperation(operation: CreateMutationOperation<ExtractModelAttributes<TModel>, TRelations>): this {
      this.mutate.push(operation);
      return this;
   }

   /**
    * Ajoute une opération de mise à jour déjà construite
    */
   public addUpdateOperation(operation: UpdateMutationOperation<Partial<ExtractModelAttributes<TModel>>, TRelations>): this {
      this.mutate.push(operation);
      return this;
   }

   /**
    * Construit et retourne l'objet de requête final
    */
   public build(): MutationRequest<ExtractModelAttributes<TModel> | Partial<ExtractModelAttributes<TModel>>, TRelations> {
      return { mutate: this.mutate };
   }
}
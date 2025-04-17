import { } from "@/types";
import { AttachRelationDefinition, DetachRelationDefinition, SyncRelationDefinition, ToggleRelationDefinition, MutationOperation } from "@/types/mutate";
import type { RequestConfig } from "@/types/common";
import type { MutationResponse } from "@/types/mutate";
import { IMutation } from "@/interfaces";

type ExtractModelAttributes<T> = Omit<T, 'relations'>;

// Type de relation
type RelationDefinition<T = unknown> =
   | { operation: "create"; attributes: T; relations?: Record<string, RelationDefinition<unknown>>; }
   | { operation: "update"; key: string | number; attributes: T; relations?: Record<string, RelationDefinition<unknown>>; }
   | AttachRelationDefinition
   | DetachRelationDefinition
   | SyncRelationDefinition<T>
   | ToggleRelationDefinition<T>;

export class Builder<TModel> {
   private static instance: Builder<unknown>;
   private mutate: Array<MutationOperation<ExtractModelAttributes<TModel>>> = [];
   private mutationService: IMutation<TModel> | null = null;

   private constructor () {
      // Constructeur privé pour le pattern singleton
   }

   public static createBuilder<T>(mutationService?: IMutation<T>): Builder<T> {
      if (!Builder.instance) {
         Builder.instance = new Builder<T>();
      }

      const builder = Builder.instance as Builder<T>;

      // Si un service de mutation est fourni, l'enregistrer
      if (mutationService) {
         builder.mutationService = mutationService;
      }

      // Réinitialiser les opérations pour chaque nouvelle instance
      builder.mutate = [];

      return builder;
   }

   /**
    * Permet à la classe Mutation d'accéder aux opérations
    */
   public getOperations(): Array<MutationOperation<ExtractModelAttributes<TModel>>> {
      return this.mutate;
   }

   /**
    * Exécute la mutation en délégant au service parent
    */
   public mutateNow(options?: Partial<RequestConfig>): Promise<MutationResponse> {
      if (!this.mutationService) {
         throw new Error("Aucun service de mutation n'a été associé à ce builder");
      }

      // On passe this (le builder) au service de mutation
      return this.mutationService.mutate(this, options);
   }

   public createEntity<T extends Record<string, unknown>>(
      attributes: T
   ): this {
      // Séparer les attributs normaux des attributs de relation
      const normalAttributes: Record<string, unknown> = {};
      const relations: Record<string, RelationDefinition<unknown>> = {};

      // Parcourir tous les attributs pour identifier les relations
      for (const [key, value] of Object.entries(attributes)) {
         // Vérifier si l'attribut est une relation (a une propriété 'operation')
         if (value && typeof value === 'object' && 'operation' in value) {
            relations[key] = value as RelationDefinition<unknown>;
         } else {
            normalAttributes[key] = value;
         }
      }

      const operation: MutationOperation<ExtractModelAttributes<TModel>> = {
         operation: "create",
         attributes: normalAttributes as ExtractModelAttributes<TModel>,
         ...(Object.keys(relations).length > 0 && { relations })
      };

      this.mutate.push(operation);
      return this;
   }

   public updateEntity<T extends Record<string, unknown>>(
      key: string | number,
      attributes: T
   ): this {
      // Même logique que createEntity pour séparer les attributs normaux des relations
      const normalAttributes: Record<string, unknown> = {};
      const relations: Record<string, RelationDefinition<unknown>> = {};

      for (const [attrKey, value] of Object.entries(attributes)) {
         if (value && typeof value === 'object' && 'operation' in value) {
            relations[attrKey] = value as RelationDefinition<unknown>;
         } else {
            normalAttributes[attrKey] = value;
         }
      }

      const operation: MutationOperation<ExtractModelAttributes<TModel>> = {
         operation: "update",
         key,
         attributes: normalAttributes as ExtractModelAttributes<TModel>,
         ...(Object.keys(relations).length > 0 && { relations })
      };

      this.mutate.push(operation);
      return this;
   }

   /**
    * Crée une relation avec des attributs donnés.
    * Retourne un objet qui correspond au type T tout en étant une relation.
    */
   public createRelation<T>(
      attributes: T
   ): T & { operation: "create"; attributes: T; relations?: Record<string, RelationDefinition<unknown>>; __relationDefinition?: true; } {
      // Séparer les attributs normaux des attributs de relation pour les relations imbriquées
      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, RelationDefinition<unknown>> = {};

      if (attributes && typeof attributes === 'object') {
         for (const [key, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (value && typeof value === 'object' && 'operation' in value) {
               nestedRelations[key] = value as RelationDefinition<unknown>;
            } else {
               normalAttributes[key] = value;
            }
         }
      }

      // Créer un objet qui est à la fois une relation et correspond au type T
      const relationDefinition = {
         operation: "create",
         attributes: normalAttributes as T,
         ...(Object.keys(nestedRelations).length > 0 && { relations: nestedRelations }),
         __relationDefinition: true
      } as T & { operation: "create"; attributes: T; relations?: Record<string, RelationDefinition<unknown>>; __relationDefinition?: true; };

      // Pour les propriétés de l'objet original, créer des getters qui renvoient les valeurs
      // depuis attributes pour que l'objet relation se comporte comme l'objet original
      if (attributes && typeof attributes === 'object') {
         for (const key of Object.keys(normalAttributes)) {
            Object.defineProperty(relationDefinition, key, {
               get() {
                  return normalAttributes[key];
               },
               enumerable: true
            });
         }
      }

      return relationDefinition;
   }

   public updateRelation<T>(
      key: string | number,
      attributes: T
   ): T & { operation: "update"; key: string | number; attributes: T; relations?: Record<string, RelationDefinition<unknown>>; __relationDefinition?: true; } {
      // Même logique pour les relations imbriquées
      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, RelationDefinition<unknown>> = {};

      if (attributes && typeof attributes === 'object') {
         for (const [attrKey, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (value && typeof value === 'object' && 'operation' in value) {
               nestedRelations[attrKey] = value as RelationDefinition<unknown>;
            } else {
               normalAttributes[attrKey] = value;
            }
         }
      }

      const relationDefinition = {
         operation: "update",
         key,
         attributes: normalAttributes as T,
         ...(Object.keys(nestedRelations).length > 0 && { relations: nestedRelations }),
         __relationDefinition: true
      } as T & { operation: "update"; key: string | number; attributes: T; relations?: Record<string, RelationDefinition<unknown>>; __relationDefinition?: true; };

      // Même approche avec les getters
      if (attributes && typeof attributes === 'object') {
         for (const key of Object.keys(normalAttributes)) {
            Object.defineProperty(relationDefinition, key, {
               get() {
                  return normalAttributes[key];
               },
               enumerable: true
            });
         }
      }

      return relationDefinition;
   }

   public attach(key: string | number): AttachRelationDefinition {
      return {
         operation: "attach",
         key
      };
   }

   public detach(key: string | number): DetachRelationDefinition {
      return {
         operation: "detach",
         key
      };
   }

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

   public build(): Array<MutationOperation<ExtractModelAttributes<TModel>>> {
      return this.mutate;
   }
}
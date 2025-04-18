import { AttachRelationDefinition, DetachRelationDefinition, SyncRelationDefinition, ToggleRelationDefinition, MutationOperation } from "@/types/mutate";

type ExtractModelAttributes<T> = Omit<T, 'relations'>;

// Type de relation avec paramètre générique pour le type des relations
// Type de relation avec paramètre générique pour le type des relations
type RelationDefinition<T = unknown, R = unknown> =
   | { operation: "create"; attributes: T; relations?: Record<string, RelationDefinition<R, unknown>>; __relationDefinition?: true; }
   | { operation: "update"; key: string | number; attributes: T; relations?: Record<string, RelationDefinition<R, unknown>>; __relationDefinition?: true; }
   | AttachRelationDefinition
   | DetachRelationDefinition
   | SyncRelationDefinition<T>
   | ToggleRelationDefinition<T>;

export class Builder<TModel> {
   private static instance: Builder<unknown>;
   private mutate: Array<MutationOperation<ExtractModelAttributes<TModel>>> = [];

   public static createBuilder<T>(): Builder<T> {
      if (!Builder.instance) {
         Builder.instance = new Builder<T>();
      }
      return Builder.instance as Builder<T>;
   }

   public createEntity<T extends Record<string, unknown>>(
      attributes: T
   ): this {
      // Séparer les attributs normaux des attributs de relation
      const normalAttributes: Record<string, unknown> = {};
      const relations: Record<string, RelationDefinition<unknown, unknown>> = {};

      // Parcourir tous les attributs pour identifier les relations
      for (const [key, value] of Object.entries(attributes)) {
         // Vérifier si l'attribut est une relation (a une propriété 'operation')
         if (value && typeof value === 'object' && 'operation' in value) {
            relations[key] = value as RelationDefinition<unknown, unknown>;
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
      const relations: Record<string, RelationDefinition<unknown, unknown>> = {};

      for (const [attrKey, value] of Object.entries(attributes)) {
         if (value && typeof value === 'object' && 'operation' in value) {
            relations[attrKey] = value as RelationDefinition<unknown, unknown>;
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
    * Crée une relation avec des attributs donnés et des relations optionnelles.
    * @param attributes Les attributs de la relation
    * @param relations Les relations imbriquées explicites (optionnel)
    */
   public createRelation<T, R = unknown>(
      attributes: T,
      relations?: Record<string, RelationDefinition<unknown, R>>
   ): T & {
      operation: "create";
      attributes: T;
      relations?: Record<string, RelationDefinition<unknown, R>>;
      __relationDefinition?: true;
   } {
      // Séparer les attributs normaux des attributs de relation pour les relations imbriquées
      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, RelationDefinition<unknown, unknown>> = {};

      // Extraire les relations des attributs si elles ne sont pas fournies explicitement
      if (!relations && attributes && typeof attributes === 'object') {
         for (const [key, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (value && typeof value === 'object' && 'operation' in value) {
               nestedRelations[key] = value as RelationDefinition<unknown, unknown>;
            } else {
               normalAttributes[key] = value;
            }
         }
      } else if (attributes && typeof attributes === 'object') {
         // Si des relations sont fournies explicitement, extraire seulement les attributs normaux
         for (const [key, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (!(value && typeof value === 'object' && 'operation' in value)) {
               normalAttributes[key] = value;
            }
         }
      }

      // Créer un objet qui est à la fois une relation et correspond au type T
      const relationDefinition = {
         operation: "create",
         attributes: normalAttributes as T,
         // Utiliser les relations explicites si fournies, sinon utiliser celles extraites des attributs
         ...(relations ? { relations } : (Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {})),
         __relationDefinition: true
      } as T & {
         operation: "create";
         attributes: T;
         relations?: Record<string, RelationDefinition<unknown, R>>;
         __relationDefinition?: true;
      };

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

   /**
    * Met à jour une relation avec des attributs donnés et des relations optionnelles.
    * @param key La clé de la relation à mettre à jour
    * @param attributes Les attributs de la relation
    * @param relations Les relations imbriquées explicites (optionnel)
    */
   public updateRelation<T, R = unknown>(
      key: string | number,
      attributes: T,
      relations?: Record<string, RelationDefinition<unknown, R>>
   ): T & {
      operation: "update";
      key: string | number;
      attributes: T;
      relations?: Record<string, RelationDefinition<unknown, R>>;
      __relationDefinition?: true;
   } {
      // Séparer les attributs normaux des attributs de relation pour les relations imbriquées
      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, RelationDefinition<unknown, unknown>> = {};

      // Extraire les relations des attributs si elles ne sont pas fournies explicitement
      if (!relations && attributes && typeof attributes === 'object') {
         for (const [attrKey, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (value && typeof value === 'object' && 'operation' in value) {
               nestedRelations[attrKey] = value as RelationDefinition<unknown, unknown>;
            } else {
               normalAttributes[attrKey] = value;
            }
         }
      } else if (attributes && typeof attributes === 'object') {
         // Si des relations sont fournies explicitement, extraire seulement les attributs normaux
         for (const [attrKey, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (!(value && typeof value === 'object' && 'operation' in value)) {
               normalAttributes[attrKey] = value;
            }
         }
      }

      const relationDefinition = {
         operation: "update",
         key,
         attributes: normalAttributes as T,
         // Utiliser les relations explicites si fournies, sinon utiliser celles extraites des attributs
         ...(relations ? { relations } : (Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {})),
         __relationDefinition: true
      } as T & {
         operation: "update";
         key: string | number;
         attributes: T;
         relations?: Record<string, RelationDefinition<unknown, R>>;
         __relationDefinition?: true;
      };

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
type ExtractModelAttributes<T> = Omit<T, 'relations'>;
/**
 * Système de builder avec contraintes sur les opérations et typage générique
 */

// Types pour différencier les contextes d'opération
type RootContext = 'root';
type CreateContext = 'create';
type UpdateContext = 'update';
type AttachContext = 'attach';
type DetachContext = 'detach';
type SyncContext = 'sync';
type ToggleContext = 'toggle';

type OperationContext =
   | RootContext
   | CreateContext
   | UpdateContext
   | AttachContext
   | DetachContext
   | SyncContext
   | ToggleContext;

// Opérations permises selon le contexte
interface OperationConstraints {
   root: 'create' | 'update';
   create: 'create' | 'attach' | 'sync';
   update: 'update' | 'attach' | 'detach' | 'sync' | 'toggle';
   attach: never;  // Pas d'opérations imbriquées
   detach: never;  // Pas d'opérations imbriquées
   sync: never;    // Pas d'opérations imbriquées
   toggle: never;  // Pas d'opérations imbriquées
}

export class Builder<TModel, TContext extends OperationContext = 'root'> {
   private mutate: Array<any> = [];

   constructor (private context: TContext = 'root' as TContext) { }

   /**
    * Crée une nouvelle instance du Builder
    */
   public static createBuilder<T>(): Builder<T, 'root'> {
      return new Builder<T, 'root'>('root');
   }

   /**
    * Ajoute une opération de création à la requête
    * Disponible seulement dans les contextes root ou create
    */
   public createEntity(
      this: Builder<TModel, Extract<TContext, 'root' | 'create'>>,
      attributes: ExtractModelAttributes<TModel>,
      relations?: Record<string, any>
   ): Builder<TModel, 'root'> {
      const operation = {
         operation: "create",
         attributes,
         ...(relations && { relations })
      };

      this.mutate.push(operation);
      return this as unknown as Builder<TModel, 'root'>;
   }

   /**
    * Ajoute une opération de mise à jour à la requête
    * Disponible seulement dans les contextes root ou update
    */
   public update(
      this: Builder<TModel, Extract<TContext, 'root' | 'update'>>,
      key: string | number,
      attributes: Partial<ExtractModelAttributes<TModel>>,
      relations?: Record<string, any>
   ): Builder<TModel, 'root'> {
      const operation = {
         operation: "update",
         key,
         attributes: attributes as ExtractModelAttributes<TModel>,
         ...(relations && { relations })
      };

      this.mutate.push(operation);
      return this as unknown as Builder<TModel, 'root'>;
   }

   /**
    * Construit et retourne l'objet de requête final
    */
   public build(this: Builder<TModel, 'root'>): Array<any> {
      return this.mutate;
   }

   // Méthodes pour créer des relations avec contexte ET typage générique

   /**
    * Crée une définition de relation de type "create"
    */
   public createRelation<TRelation>(
      attributes: ExtractModelAttributes<TRelation>,
      nestedRelations?: Record<string, any>
   ): ReturnType<Builder<TRelation, 'create'>['withRelations']> {
      const relationBuilder = new Builder<TRelation, 'create'>('create');
      return relationBuilder.withRelations({
         operation: "create",
         attributes,
         ...(nestedRelations && { relations: nestedRelations })
      });
   }

   /**
    * Crée une définition de relation de type "update"
    */
   public updateRelation<TRelation>(
      key: string | number,
      attributes: Partial<ExtractModelAttributes<TRelation>>,
      nestedRelations?: Record<string, any>
   ): ReturnType<Builder<TRelation, 'update'>['withRelations']> {
      const relationBuilder = new Builder<TRelation, 'update'>('update');
      return relationBuilder.withRelations({
         operation: "update",
         key,
         attributes: attributes as ExtractModelAttributes<TRelation>,
         ...(nestedRelations && { relations: nestedRelations })
      });
   }

   /**
    * Crée une définition de relation de type "attach"
    */
   public attach<TRelation>(
      key: string | number | Array<string | number>
   ): ReturnType<Builder<TRelation, 'attach'>['withRelations']> {
      const relationBuilder = new Builder<TRelation, 'attach'>('attach');
      return relationBuilder.withRelations({
         operation: "attach",
         key
      });
   }

   /**
    * Crée une définition de relation de type "detach"
    */
   public detach<TRelation>(
      key: string | number | Array<string | number>
   ): ReturnType<Builder<TRelation, 'detach'>['withRelations']> {
      const relationBuilder = new Builder<TRelation, 'detach'>('detach');
      return relationBuilder.withRelations({
         operation: "detach",
         key
      });
   }

   /**
    * Crée une définition de relation de type "sync"
    */
   public sync<TRelation>(
      key: string | number | Array<string | number>,
      attributes?: Partial<ExtractModelAttributes<TRelation>>,
      pivot?: Record<string, string | number>,
      withoutDetaching?: boolean
   ): ReturnType<Builder<TRelation, 'sync'>['withRelations']> {
      const relationBuilder = new Builder<TRelation, 'sync'>('sync');
      return relationBuilder.withRelations({
         operation: "sync",
         key,
         without_detaching: withoutDetaching,
         ...(attributes && { attributes }),
         ...(pivot && { pivot })
      });
   }

   /**
    * Crée une définition de relation de type "toggle"
    */
   public toggle<TRelation>(
      key: string | number | Array<string | number>,
      attributes?: Partial<ExtractModelAttributes<TRelation>>,
      pivot?: Record<string, string | number>
   ): ReturnType<Builder<TRelation, 'toggle'>['withRelations']> {
      const relationBuilder = new Builder<TRelation, 'toggle'>('toggle');
      return relationBuilder.withRelations({
         operation: "toggle",
         key,
         ...(attributes && { attributes }),
         ...(pivot && { pivot })
      });
   }

   // Méthode interne pour gérer la relation
   private withRelations(operation: any): any {
      return operation;
   }

   // Méthode pour suggérer les opérations valides dans le contexte courant
   public getValidOperations(): Array<keyof OperationConstraints[TContext]> {
      const constraints: Record<OperationContext, Array<string>> = {
         root: ['create', 'update'],
         create: ['create', 'attach', 'sync'],
         update: ['update', 'attach', 'detach', 'sync', 'toggle'],
         attach: [],
         detach: [],
         sync: [],
         toggle: []
      };

      return constraints[this.context] as Array<keyof OperationConstraints[TContext]>;
   }
}
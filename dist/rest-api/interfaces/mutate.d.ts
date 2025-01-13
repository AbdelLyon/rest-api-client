export type Operation = "create" | "update" | "attach" | "detach" | "sync" | "toggle";
export type Attributes<TAttributes extends string> = Record<TAttributes, string | number | boolean>;
export interface Pivot {
    [key: string]: string;
}
export interface BaseRelation<TAttributes extends string, TRelations extends string> {
    operation: Operation;
    attributes?: Attributes<TAttributes>;
    relations?: RelationsMap<TAttributes, TRelations>;
    key?: number;
    pivot?: Pivot;
}
export interface SyncRelation<TAttributes extends string, TRelations extends string> extends BaseRelation<TAttributes, TRelations> {
    operation: "sync";
    without_detaching?: boolean;
}
export type Relation<TAttributes extends string, TRelations extends string> = BaseRelation<TAttributes, TRelations> | SyncRelation<TAttributes, TRelations>;
export type RelationsMap<TAttributes extends string, TRelations extends string> = {
    [key in TRelations]?: Relation<TAttributes, TRelations> | Array<Relation<TAttributes, TRelations>>;
};
export interface MutateRequest<TAttributes extends string, TRelations extends string> {
    operation: Operation;
    key?: number;
    attributes: Attributes<TAttributes>;
    relations?: RelationsMap<TAttributes, TRelations>;
}
export interface MutatePayload<TAttributes extends string, TRelations extends string> {
    mutate: Array<MutateRequest<TAttributes, TRelations>>;
}
export interface MutateResponse<T> {
    data: Array<T>;
}

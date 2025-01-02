export type Operation = "create" | "update" | "attach" | "detach" | "sync" | "toggle";
export interface Attributes {
    [key: string]: string | number;
}
export interface Pivot {
    [key: string]: string;
}
export interface BaseRelation {
    operation: Operation;
    attributes?: Attributes;
    relations?: RelationsMap;
    key?: number;
    pivot?: Pivot;
}
export interface SyncRelation extends BaseRelation {
    operation: "sync";
    without_detaching?: boolean;
}
export type Relation = BaseRelation | SyncRelation;
export interface RelationsMap {
    [key: string]: Relation | Relation[];
}
export interface MutateRequest {
    operation: Operation;
    key?: number;
    attributes: Attributes;
    relations?: RelationsMap;
}
export interface MutatePayload {
    mutate: MutateRequest[];
}
export interface MutateResponse<T> {
    data: T[];
}

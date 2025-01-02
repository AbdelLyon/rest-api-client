export interface ActionField {
    name: string;
    value: string | number | boolean;
}
export interface ActionFilter {
    field: string;
    value: boolean | string | number;
}
export interface paramsAction {
    fields: ActionField[];
    search?: {
        filters?: ActionFilter[];
    };
}
export interface ActionRequest {
    action: string;
    params: paramsAction;
}
export interface DeleteRequest {
    resources: string[] | number[];
}
export interface ActionResponse {
    success: boolean;
    data?: any;
}

import { Permission } from '../../http/types/http.js';
export interface DeleteRequest {
    resources: Array<number | string>;
}
export interface DeleteResponse<T> {
    data: Array<T>;
    meta?: {
        gates?: Partial<Permission>;
    };
}

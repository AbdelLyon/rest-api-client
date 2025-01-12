export interface BaseModel {
    id: string | number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}
export interface Gates {
    authorized_to_update: boolean;
    authorized_to_delete: boolean;
}

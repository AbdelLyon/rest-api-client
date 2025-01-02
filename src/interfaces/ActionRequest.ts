export interface ActionField {
  name: string;
  value: string | number | boolean;
}

export interface ActionFilter {
  field: string;
  value: boolean | string | number;
}

export interface ActionRequest {
  fields: ActionField[];
  search?: {
    filters?: ActionFilter[];
  };
}

export interface DeleteRequest {
  resources: string[] | number[];
}

export interface ActionField {
  name: string;
  value: string | number | boolean;
}

export interface ActionFilter {
  field: string;
  value: boolean | string | number;
}

export interface paramsAction {
  fields: Array<ActionField>;
  search?: {
    filters?: Array<ActionFilter>;
  };
}

export interface ActionRequest {
  action: string;
  params: paramsAction;
}

export interface DeleteRequest {
  resources: Array<string> | Array<number>;
}

export interface ActionResponse {
  data: {
    impacted: number;
  };
}

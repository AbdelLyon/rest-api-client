export interface ActionField {
  name: string;
  value: string | number | boolean;
}

export interface ActionFilter {
  field: string;
  value: boolean | string | number;
}

export interface payloadAction {
  fields: Array<ActionField>;
  search?: {
    filters?: Array<ActionFilter>;
  };
}

export interface ActionRequest {
  action: string;
  payload: payloadAction;
}

export interface ActionResponse {
  data: {
    impacted: number;
  };
}

export interface ActionFieldDefinition {
  name: string;
  value: string | number | boolean;
}

export interface ActionFilterCriteria {
  field: string;
  value: boolean | string | number;
}

export interface ActionPayload {
  fields: Array<ActionFieldDefinition>;
  search?: {
    filters?: Array<ActionFilterCriteria>;
  };
}

export interface ActionRequest {
  action: string;
  payload: ActionPayload;
}

export interface ActionResponse {
  data: {
    impacted: number;
  };
}

export interface DetailsActionField {
  [key: string]: Array<string>;
}

export interface DetailsActionMeta {
  [key: string]: unknown;
}

export interface DetailsAction {
  name: string;
  uriKey: string;
  fields: DetailsActionField;
  meta: DetailsActionMeta;
  is_standalone: boolean;
}

export interface DetailsInstruction {
  name: string;
  uriKey: string;
  fields: DetailsActionField;
  meta: DetailsActionMeta;
}

export interface DetailsRelationConstraints {
  required_on_creation: boolean;
  prohibited_on_creation: boolean;
  required_on_update: boolean;
  prohibited_on_update: boolean;
}

export interface DetailsRelation {
  resources: Array<string>;
  relation: string;
  constraints: DetailsRelationConstraints;
  name: string;
}

export interface DetailsValidationRules {
  all?: Record<string, Array<string>>;
  create?: Record<string, Array<string>>;
  update?: Record<string, Array<string>>;
}

export interface DetailsResource {
  actions: Array<DetailsAction>;
  instructions: Array<DetailsInstruction>;
  fields: Array<string>;
  limits: Array<number>;
  scopes: Array<string>;
  relations: Array<DetailsRelation>;
  rules: DetailsValidationRules;
}

export interface DetailsResponse {
  data: DetailsResource;
}

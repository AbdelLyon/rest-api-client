export type {
  ActionField,
  ActionFilter,
  ActionRequest,
  ActionResponse,
} from "@/rest-api/interfaces/action";
export type {
  Aggregate,
  AggregateType,
  BaseFilter,
  Filter,
  FilterOperator,
  FilterType,
  Gate,
  Include,
  Instruction,
  InstructionField,
  NestedFilter,
  Scope,
  ScopeParameter,
  SearchRequest,
  SearchText,
  Select,
  Sort,
  SortDirection,
  SearchResponse,
} from "@/rest-api/interfaces/search";

export type {
  MutateRequest,
  OperationType,
  AttachRelation,
  BaseMutationOperation,
  CreateOperation,
  CreateRelation,
  DetachRelation,
  MutateResponse,
  MutationOperation,
  RelationOperation,
  SyncRelation,
  ToggleRelation,
  UpdateOperation,
} from "@/rest-api/interfaces/mutate";

export type {
  DetailsAction,
  DetailsActionField,
  DetailsActionMeta,
  DetailsInstruction,
  DetailsRelation,
  DetailsRelationConstraints,
  DetailsResource,
  DetailsResponse,
  DetailsValidationRules,
} from "@/rest-api/interfaces/details";

export type {
  DeleteRequest,
  DeleteResponse,
} from "@/rest-api/interfaces/delete";

export type {
  ActionField,
  ActionFilter,
  ActionRequest,
  ActionResponse,
} from "@/rest-api/types/action";
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
} from "@/rest-api/types/search";

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
} from "@/rest-api/types/mutate";

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
} from "@/rest-api/types/details";

export type { DeleteRequest, DeleteResponse } from "@/rest-api/types/delete";

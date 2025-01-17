import type { MutateRequest, MutateResponse } from "../types/mutate";
import type { ActionRequest, ActionResponse } from "../types/action";
import type { DeleteRequest, DeleteResponse } from "../types/delete";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { DetailsResponse, SearchRequest, SearchResponse } from "../types";

export interface IHttpConfig {
  getAxiosInstance: () => AxiosInstance;
  getFullBaseUrl: () => string;
  setAxiosInstance: (instance: AxiosInstance) => void;
}

export interface IHttp {
  request: <TResponse>(
    config: AxiosRequestConfig,
    options?: Partial<AxiosRequestConfig>,
  ) => Promise<TResponse>;
}

export interface IQuery<T> {
  search: (
    searchRequest: SearchRequest,
    options?: Partial<AxiosRequestConfig>,
  ) => Promise<Array<T>>;
  searchPaginate: (
    searchRequest: SearchRequest,
    options?: Partial<AxiosRequestConfig>,
  ) => Promise<SearchResponse<T>>;
  getdetails: (
    options?: Partial<AxiosRequestConfig>,
  ) => Promise<DetailsResponse>;
}

export interface IMutation<T> {
  mutate: <
    TAttributes,
    TRelations,
    TRelationAttributesMap extends Record<keyof TRelations, unknown>,
  >(
    mutateRequest: MutateRequest<
      TAttributes,
      TRelations,
      TRelationAttributesMap
    >,
  ) => Promise<MutateResponse<T>>;
  executeAction: (actionRequest: ActionRequest) => Promise<ActionResponse>;
  delete: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
  forceDelete: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
  restore: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
}

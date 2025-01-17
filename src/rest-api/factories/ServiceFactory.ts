import { ApiRequestServiceFactory } from "./ApiRequestServiceFactory";
import { MutationServiceFactory } from "./MutationServiceFactory";
import { QueryServiceFactory } from "./QueryServiceFactory";
import type {
  IApiRequest,
  IHttpConfig,
  IMutation,
  IQuery,
} from "../services/inerfaces";

interface ServiceBundle<T> {
  apiRequest: IApiRequest;
  queryService: IQuery<T>;
  mutationService: IMutation<T>;
}

export class ServiceFactory {
  static createApiRequest(httpConfig: IHttpConfig): IApiRequest {
    return ApiRequestServiceFactory.create(httpConfig);
  }

  static createQueryService<T>(apiRequest: IApiRequest): IQuery<T> {
    return QueryServiceFactory.create<T>(apiRequest);
  }

  static createMutationService<T>(apiRequest: IApiRequest): IMutation<T> {
    return MutationServiceFactory.create<T>(apiRequest);
  }

  static createAll<T>(httpConfig: IHttpConfig): ServiceBundle<T> {
    const apiRequest = this.createApiRequest(httpConfig);

    return {
      apiRequest,
      queryService: this.createQueryService<T>(apiRequest),
      mutationService: this.createMutationService<T>(apiRequest),
    };
  }
}

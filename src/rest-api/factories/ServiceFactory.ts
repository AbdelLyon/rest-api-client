import { ApiRequesteFactory } from "./HttpRequestFactory";
import { QueryFactory } from "./QueryFactory";
import { MutationFactory } from "./MutationFactory";
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
    return ApiRequesteFactory.create(httpConfig);
  }

  static createQuery<T>(apiRequest: IApiRequest): IQuery<T> {
    return QueryFactory.create<T>(apiRequest);
  }

  static createMutation<T>(apiRequest: IApiRequest): IMutation<T> {
    return MutationFactory.create<T>(apiRequest);
  }

  static createAll<T>(httpConfig: IHttpConfig): ServiceBundle<T> {
    const apiRequest = this.createApiRequest(httpConfig);

    return {
      apiRequest,
      queryService: this.createQuery<T>(apiRequest),
      mutationService: this.createMutation<T>(apiRequest),
    };
  }
}

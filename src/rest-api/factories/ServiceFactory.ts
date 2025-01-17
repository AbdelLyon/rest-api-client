import { ApiRequesteFactory } from "./HttpRequestFactory";
import { QueryFactory } from "./QueryFactory";
import { MutationFactory } from "./MutationFactory";
import type {
  IHttp,
  IHttpConfig,
  IMutation,
  IQuery,
} from "../services/inerfaces";

interface ServiceBundle<T> {
  apiRequest: IHttp;
  queryService: IQuery<T>;
  mutationService: IMutation<T>;
}

export class ServiceFactory {
  static createApiRequest(httpConfig: IHttpConfig): IHttp {
    return ApiRequesteFactory.create(httpConfig);
  }

  static createQuery<T>(apiRequest: IHttp): IQuery<T> {
    return QueryFactory.create<T>(apiRequest);
  }

  static createMutation<T>(apiRequest: IHttp): IMutation<T> {
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

import { ApiRequest } from "../services/ApiRequest";
import type { IApiRequest, IHttpConfig } from "../services/inerfaces";
import { Container } from "@/rest-api/di/Container";
import { TOKENS } from "@/rest-api/di/tokens";

export class ApiRequesteFactory {
  static create(httpConfig: IHttpConfig): IApiRequest {
    Container.reset();
    Container.bind<IHttpConfig>(TOKENS.IHttpConfig).toInstance(httpConfig);
    Container.bind<IApiRequest>(TOKENS.IApiRequest).to(ApiRequest);
    return Container.resolve<IApiRequest>(TOKENS.IApiRequest);
  }
}

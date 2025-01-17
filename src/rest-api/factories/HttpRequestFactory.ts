import { Http } from "../services/Http";
import type { IHttp, IHttpConfig } from "../services/inerfaces";
import { Container } from "@/rest-api/di/Container";
import { TOKENS } from "@/rest-api/di/tokens";

export class ApiRequesteFactory {
  static create(httpConfig: IHttpConfig): IHttp {
    Container.reset();
    Container.bind<IHttpConfig>(TOKENS.IHttpConfig).toInstance(httpConfig);
    Container.bind<IHttp>(TOKENS.IHttp).to(Http);
    return Container.resolve<IHttp>(TOKENS.IHttp);
  }
}

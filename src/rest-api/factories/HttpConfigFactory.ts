import { HttpConfig } from "../services/HttpConfig";
import type { IHttpConfig } from "../services";
import { Container } from "@/rest-api/di/Container";
import { TOKENS } from "@/rest-api/di/tokens";

export class HttpConfigFactory {
  static create(domain: string, baseUrl: string): IHttpConfig {
    Container.bind<IHttpConfig>(TOKENS.IHttpConfig).to(HttpConfig);
    Container.resolve<IHttpConfig>(TOKENS.IHttpConfig);

    return new HttpConfig(domain, baseUrl);
  }
}

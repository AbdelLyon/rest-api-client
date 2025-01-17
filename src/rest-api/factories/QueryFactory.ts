import { Query } from "../services/Query";
import type { IApiRequest, IQuery } from "../services/inerfaces";
import { Container } from "@/rest-api/di/Container";
import { TOKENS } from "@/rest-api/di/tokens";

export class QueryFactory {
  static create<T>(apiRequest: IApiRequest): IQuery<T> {
    Container.bind<IApiRequest>(TOKENS.IApiRequest).toInstance(apiRequest);
    Container.bind<IQuery<T>>(TOKENS.IQuery).to(Query);
    return Container.resolve<IQuery<T>>(TOKENS.IQuery);
  }
}

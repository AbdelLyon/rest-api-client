import { Query } from "../services/Query";
import type { IHttp, IQuery } from "../services/inerfaces";
import { Container } from "@/rest-api/di/Container";
import { TOKENS } from "@/rest-api/di/tokens";

export class QueryFactory {
  static create<T>(apiRequest: IHttp): IQuery<T> {
    Container.bind<IHttp>(TOKENS.IHttp).toInstance(apiRequest);
    Container.bind<IQuery<T>>(TOKENS.IQuery).to(Query);
    return Container.resolve<IQuery<T>>(TOKENS.IQuery);
  }
}

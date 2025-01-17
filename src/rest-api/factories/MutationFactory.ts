import { Mutation } from "../services/Mutation";
import type { IHttp, IMutation } from "../services/inerfaces";
import { Container } from "@/rest-api/di/Container";
import { TOKENS } from "@/rest-api/di/tokens";

export class MutationFactory {
  static create<T>(apiRequest: IHttp): IMutation<T> {
    Container.bind<IHttp>(TOKENS.IHttp).toInstance(apiRequest);
    Container.bind<IMutation<T>>(TOKENS.IMutation).to(Mutation);
    return Container.resolve<IMutation<T>>(TOKENS.IMutation);
  }
}

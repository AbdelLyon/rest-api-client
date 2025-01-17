import { MutationService } from "../services/Mutation";
import type { IApiRequest, IMutation } from "../services/inerfaces";
import { Container } from "@/rest-api/di/Container";
import { TOKENS } from "@/rest-api/di/tokens";

export class MutationServiceFactory {
  static create<T>(apiRequest: IApiRequest): IMutation<T> {
    Container.bind<IApiRequest>(TOKENS.IApiRequest).toInstance(apiRequest);
    Container.bind<IMutation<T>>(TOKENS.IMutation).to(MutationService);
    return Container.resolve<IMutation<T>>(TOKENS.IMutation);
  }
}

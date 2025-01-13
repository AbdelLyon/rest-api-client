import { useMutation } from "@tanstack/react-query";
import type {
  Attributes,
  MutatePayload,
  MutateResponse,
  Operation,
  RelationsMap,
} from "../interfaces";
import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

interface UseMutateRequestParams<
  TAttributes extends string,
  TRelations extends string,
  TRes,
> {
  requestFn: (
    request: MutatePayload<TAttributes, TRelations>,
  ) => Promise<MutateResponse<TRes>>;
  options?: MutateOptions<TAttributes, TRelations, TRes>;
}

export type MutateOptions<
  TAttributes extends string,
  TRelations extends string,
  TRes,
> = Omit<
  UseMutationOptions<
    MutateResponse<TRes>,
    Error,
    MutatePayload<TAttributes, TRelations>
  >,
  "mutationFn"
>;

type Return<
  TAttributes extends string,
  TRelations extends string,
  TRes,
> = UseMutationResult<
  MutateResponse<TRes>,
  Error,
  MutatePayload<TAttributes, TRelations>
> & {
  createMutatePayload: (
    operation: Operation,
    attributes: Attributes<TAttributes>,
    key?: number,
    relations?: RelationsMap<TAttributes, TRelations>,
  ) => MutatePayload<TAttributes, TRelations>;
};

export function useMutateRequest<
  TAttributes extends string,
  TRelations extends string,
  TRes,
>({
  requestFn,
  options,
}: UseMutateRequestParams<TAttributes, TRelations, TRes>): Return<
  TAttributes,
  TRelations,
  TRes
> {
  const mutation = useMutation({
    mutationFn: (request: MutatePayload<TAttributes, TRelations>) => {
      return requestFn(request);
    },
    ...options,
  });

  const createMutatePayload = (
    operation: Operation,
    attributes: Attributes<TAttributes>,
    key?: number,
    relations?: RelationsMap<TAttributes, TRelations>,
  ): MutatePayload<TAttributes, TRelations> => {
    return {
      mutate: [
        {
          operation,
          key,
          attributes,
          relations,
        },
      ],
    };
  };

  return {
    ...mutation,
    createMutatePayload,
  };
}

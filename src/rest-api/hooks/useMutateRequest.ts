import { useMutation } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import type {
  MutateRequest,
  MutateResponse,
  MutationOperation,
  OperationType,
  RelationOperation,
} from "../interfaces/mutate";

type RelationsMap<TAttributes, TRelations> = Partial<
  Record<
    keyof TRelations,
    | RelationOperation<TAttributes, TRelations>
    | Array<RelationOperation<TAttributes, TRelations>>
  >
>;

// Types pour le hook
interface UseMutateRequestParams<TAttributes, TRelations, TRes> {
  requestFn: (
    request: MutateRequest<TAttributes, TRelations>,
  ) => Promise<MutateResponse<TRes>>;
  options?: MutateOptions<TAttributes, TRelations, TRes>;
}

type MutateOptions<TAttributes, TRelations, TRes> = Omit<
  UseMutationOptions<
    MutateResponse<TRes>,
    Error,
    MutateRequest<TAttributes, TRelations>
  >,
  "mutationFn"
>;

type Return<TAttributes, TRelations, TRes> = UseMutationResult<
  MutateResponse<TRes>,
  Error,
  MutateRequest<TAttributes, TRelations>
> & {
  createMutateRequest: (
    operation: OperationType,
    attributes: Partial<TAttributes>,
    key?: number,
    relations?: RelationsMap<TAttributes, TRelations>,
  ) => MutateRequest<TAttributes, TRelations>;
};

// Le hook
export function useMutateRequest<TAttributes, TRelations, TRes>({
  requestFn,
  options,
}: UseMutateRequestParams<TAttributes, TRelations, TRes>): Return<
  TAttributes,
  TRelations,
  TRes
> {
  const mutation = useMutation({
    mutationFn: (request: MutateRequest<TAttributes, TRelations>) => {
      return requestFn(request);
    },
    ...options,
  });

  const createMutateRequest = (
    operation: OperationType,
    attributes: Partial<TAttributes>,
    key?: number,
    relations?: RelationsMap<TAttributes, TRelations>,
  ): MutateRequest<TAttributes, TRelations> => {
    const mutationOperation: MutationOperation<TAttributes, TRelations> = {
      operation,
      attributes,
      ...(key !== undefined && { key }),
      ...(relations && { relations }),
    } as MutationOperation<TAttributes, TRelations>;

    return {
      mutate: [mutationOperation],
    };
  };

  return {
    ...mutation,
    createMutateRequest,
  };
}

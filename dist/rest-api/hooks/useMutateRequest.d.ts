import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { MutateRequest, MutateResponse, OperationType, RelationOperation } from '../interfaces/mutate';
type RelationsMap<TAttributes, TRelations> = Partial<Record<keyof TRelations, RelationOperation<TAttributes, TRelations> | Array<RelationOperation<TAttributes, TRelations>>>>;
interface UseMutateRequestParams<TAttributes, TRelations, TRes> {
    requestFn: (request: MutateRequest<TAttributes, TRelations>) => Promise<MutateResponse<TRes>>;
    options?: MutateOptions<TAttributes, TRelations, TRes>;
}
type MutateOptions<TAttributes, TRelations, TRes> = Omit<UseMutationOptions<MutateResponse<TRes>, Error, MutateRequest<TAttributes, TRelations>>, "mutationFn">;
type Return<TAttributes, TRelations, TRes> = UseMutationResult<MutateResponse<TRes>, Error, MutateRequest<TAttributes, TRelations>> & {
    createMutateRequest: (operation: OperationType, attributes: Partial<TAttributes>, key?: number, relations?: RelationsMap<TAttributes, TRelations>) => MutateRequest<TAttributes, TRelations>;
};
export declare function useMutateRequest<TAttributes, TRelations, TRes>({ requestFn, options, }: UseMutateRequestParams<TAttributes, TRelations, TRes>): Return<TAttributes, TRelations, TRes>;
export {};

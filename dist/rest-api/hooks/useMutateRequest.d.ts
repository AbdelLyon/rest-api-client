import { MutatePayload, MutateResponse, Operation, RelationsMap } from '../interfaces';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
interface UseMutateRequestParams<TReq extends MutatePayload, TRes> {
    requestFn: (request: TReq) => Promise<MutateResponse<TRes>>;
    options?: MutateOptions<TReq, TRes>;
}
export type MutateOptions<TReq, TRes> = Omit<UseMutationOptions<MutateResponse<TRes>, Error, TReq>, "mutationFn">;
type Return<TReq extends MutatePayload, TRes> = UseMutationResult<MutateResponse<TRes>, Error, TReq> & {
    createMutatePayload: (operation: Operation, attributes: Record<string, string | number | boolean>, key?: number, relations?: RelationsMap) => MutatePayload;
};
export declare function useMutateRequest<TReq extends MutatePayload, TRes>({ requestFn, options, }: UseMutateRequestParams<TReq, TRes>): Return<TReq, TRes>;
export {};

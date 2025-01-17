import { IMutation } from '../services';
import { DeleteRequest, DeleteResponse } from '../types/delete';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
type UseDeleteOptions<T> = Omit<UseMutationOptions<DeleteResponse<T>, Error, DeleteRequest>, "mutationFn">;
interface DeleteHookParams<T> {
    service: IMutation<T>;
    options?: UseDeleteOptions<T>;
}
export declare function useDelete<T>({ service, options, }: DeleteHookParams<T>): UseMutationResult<DeleteResponse<T>, Error, DeleteRequest>;
export declare function useForceDelete<T>({ service, options, }: DeleteHookParams<T>): UseMutationResult<DeleteResponse<T>, Error, DeleteRequest>;
export declare function useRestore<T>({ service, options, }: DeleteHookParams<T>): UseMutationResult<DeleteResponse<T>, Error, DeleteRequest>;
export {};

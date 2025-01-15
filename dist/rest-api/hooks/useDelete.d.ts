import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { MutationService } from '../services';
import { DeleteRequest, DeleteResponse } from '../interfaces/delete';
type UseDeleteOptions<T> = Omit<UseMutationOptions<DeleteResponse<T>, Error, DeleteRequest>, "mutationFn">;
export declare function useDelete<T>({ service, options, }: {
    service: MutationService<T>;
    options?: UseDeleteOptions<T>;
}): UseMutationResult<DeleteResponse<T>, Error, DeleteRequest>;
export declare function useForceDelete<T>({ service, options, }: {
    service: MutationService<T>;
    options?: UseDeleteOptions<T>;
}): UseMutationResult<DeleteResponse<T>, Error, DeleteRequest>;
export declare function useRestore<T>({ service, options, }: {
    service: MutationService<T>;
    options?: UseDeleteOptions<T>;
}): UseMutationResult<DeleteResponse<T>, Error, DeleteRequest>;
export {};

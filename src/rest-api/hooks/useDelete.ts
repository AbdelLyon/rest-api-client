import { useMutation } from "@tanstack/react-query";
import type { IMutation } from "../services";
import type { DeleteRequest, DeleteResponse } from "../types/delete";
import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

type UseDeleteOptions<T> = Omit<
  UseMutationOptions<DeleteResponse<T>, Error, DeleteRequest>,
  "mutationFn"
>;

interface DeleteHookParams<T> {
  service: IMutation<T>;
  options?: UseDeleteOptions<T>;
}

export function useDelete<T>({
  service,
  options,
}: DeleteHookParams<T>): UseMutationResult<
  DeleteResponse<T>,
  Error,
  DeleteRequest
> {
  return useMutation({
    mutationFn: (request: DeleteRequest) => service.delete(request),
    ...options,
  });
}

export function useForceDelete<T>({
  service,
  options,
}: DeleteHookParams<T>): UseMutationResult<
  DeleteResponse<T>,
  Error,
  DeleteRequest
> {
  return useMutation({
    mutationFn: (request: DeleteRequest) => service.forceDelete(request),
    ...options,
  });
}

export function useRestore<T>({
  service,
  options,
}: DeleteHookParams<T>): UseMutationResult<
  DeleteResponse<T>,
  Error,
  DeleteRequest
> {
  return useMutation({
    mutationFn: (request: DeleteRequest) => service.restore(request),
    ...options,
  });
}

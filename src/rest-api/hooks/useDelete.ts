import { useMutation } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import type { MutationService } from "../services";
import type { DeleteRequest, DeleteResponse } from "../interfaces/delete";

type UseDeleteOptions<T> = Omit<
  UseMutationOptions<DeleteResponse<T>, Error, DeleteRequest>,
  "mutationFn"
>;

export function useDelete<T>({
  service,
  options,
}: {
  service: MutationService<T>;
  options?: UseDeleteOptions<T>;
}): UseMutationResult<DeleteResponse<T>, Error, DeleteRequest> {
  return useMutation({
    mutationFn: (request: DeleteRequest) => service.delete(request),
    ...options,
  });
}

export function useForceDelete<T>({
  service,
  options,
}: {
  service: MutationService<T>;
  options?: UseDeleteOptions<T>;
}): UseMutationResult<DeleteResponse<T>, Error, DeleteRequest> {
  return useMutation({
    mutationFn: (request: DeleteRequest) => service.forceDelete(request),
    ...options,
  });
}

export function useRestore<T>({
  service,
  options,
}: {
  service: MutationService<T>;
  options?: UseDeleteOptions<T>;
}): UseMutationResult<DeleteResponse<T>, Error, DeleteRequest> {
  return useMutation({
    mutationFn: (request: DeleteRequest) => service.restore(request),
    ...options,
  });
}

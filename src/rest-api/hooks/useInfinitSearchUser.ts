import { UserService } from "../services";
import { useInfiniteRequest } from "./useInfinitSearch";
import type { QueryKey } from "@tanstack/react-query";
import type { SearchRequest } from "../interfaces";

type UseSearch = {
  queryKey: QueryKey;
  domaine: string;
  pathname: string;
  search: SearchRequest;
  initialRequest: SearchRequest;
};

export const useInfinitSearchUser = ({
  domaine,
  pathname,
  search,
  queryKey,
  initialRequest,
}: UseSearch): ReturnType<typeof useInfiniteRequest> => {
  const userService = UserService.getInstance(domaine, pathname);
  const query = useInfiniteRequest({
    queryKey,
    requestFn: () => userService.search(search),
    initialRequest,
  });
  return {
    ...query,
  };
};

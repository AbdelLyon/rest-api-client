import { useInfiniteQuery as u } from "@tanstack/react-query";
export * from "@tanstack/react-query";
function m({
  queryKey: n,
  requestFn: i,
  initialRequest: r
}) {
  return u({
    queryKey: n,
    queryFn: ({ pageParam: e = r }) => i(e),
    initialPageParam: r,
    getNextPageParam: (e, o, t) => {
      if (!(!e.meta || e.data.length < (e.meta.perPage || 10)))
        return {
          ...t,
          page: (t.page || 1) + 1
        };
    }
  });
}
export {
  m as useInfiniteRequest
};

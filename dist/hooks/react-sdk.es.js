import { useInfiniteQuery as o } from "@tanstack/react-query";
export * from "@tanstack/react-query";
function p({
  queryKey: n,
  requestFn: i,
  initialRequest: r,
  options: u = {}
}) {
  return o({
    queryKey: n,
    queryFn: ({ pageParam: e = r }) => i(e),
    initialPageParam: r,
    getNextPageParam: (e, f, t) => {
      if (!(!e.meta || e.data.length < (e.meta.perPage || 10)))
        return {
          ...t,
          page: (t.page || 1) + 1
        };
    },
    ...u
  });
}
export {
  p as useInfiniteRequest
};

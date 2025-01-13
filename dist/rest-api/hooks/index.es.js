import { useInfiniteQuery as p } from "@tanstack/react-query";
function m({
  queryKey: n,
  requestFn: i,
  initialRequest: u,
  options: a
}) {
  return p({
    queryKey: n,
    queryFn: ({ pageParam: e }) => i(e),
    initialPageParam: u,
    getNextPageParam: (e, f, r) => {
      var t;
      const g = ((t = e.meta) == null ? void 0 : t.perPage) ?? 10, o = r.page ?? 1;
      if (!(e.data.length < g))
        return {
          ...r,
          page: o + 1
        };
    },
    ...a
  });
}
export {
  m as useInfiniteRequest
};

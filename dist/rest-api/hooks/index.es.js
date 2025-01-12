import { useInfiniteQuery as m } from "@tanstack/react-query";
function c({
  queryKey: a,
  requestFn: u,
  initialRequest: r,
  options: g
}) {
  return m({
    queryKey: a,
    queryFn: ({ pageParam: e = r }) => u(e),
    initialPageParam: r,
    getNextPageParam: (e, i, t) => {
      var n;
      const o = ((n = e.meta) == null ? void 0 : n.perPage) ?? 10, p = t.page ?? 1;
      if (!(!e.meta || e.data.length < o))
        return {
          ...t,
          page: p + 1
        };
    },
    ...g
  });
}
export {
  c as useInfiniteRequest
};

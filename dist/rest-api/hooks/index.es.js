import { useInfiniteQuery as s, useMutation as g } from "@tanstack/react-query";
function p({
  queryKey: n,
  requestFn: r,
  initialRequest: a,
  options: i
}) {
  return s({
    queryKey: n,
    queryFn: ({ pageParam: t }) => r(t),
    initialPageParam: a,
    getNextPageParam: (t, o, e) => {
      var c;
      const u = ((c = t.meta) == null ? void 0 : c.perPage) ?? 10, m = e.page ?? 1;
      if (!(t.data.length < u))
        return {
          ...e,
          page: m + 1
        };
    },
    ...i
  });
}
function P({
  requestFn: n,
  options: r
}) {
  return {
    ...g({
      mutationFn: (t) => n(t),
      ...r
    }),
    createMutatePayload: (t, o, e, u) => ({
      mutate: [
        {
          operation: t,
          key: e,
          attributes: o,
          relations: u
        }
      ]
    })
  };
}
export {
  p as useInfiniteRequest,
  P as useMutateRequest
};

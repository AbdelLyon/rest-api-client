import { useInfiniteQuery as m, useMutation as p, useQuery as f } from "@tanstack/react-query";
function q({
  queryKey: e,
  requestFn: n,
  initialRequest: r,
  options: i
}) {
  return m({
    queryKey: e,
    queryFn: ({ pageParam: t }) => n(t),
    initialPageParam: r,
    getNextPageParam: (t, o, u) => {
      var c;
      const a = ((c = t.meta) == null ? void 0 : c.perPage) ?? 10, s = u.page ?? 1;
      if (!(t.data.length < a))
        return {
          ...u,
          page: s + 1
        };
    },
    ...i
  });
}
function M({
  requestFn: e,
  options: n
}) {
  return {
    ...p({
      mutationFn: (t) => e(t),
      ...n
    }),
    createMutateRequest: (t, o, u, a) => ({
      mutate: [{
        operation: t,
        attributes: o,
        ...u !== void 0 && { key: u },
        ...a && { relations: a }
      }]
    })
  };
}
function P({
  queryKey: e,
  requestFn: n,
  options: r
}) {
  return f({
    queryKey: e,
    queryFn: n,
    ...r
  });
}
export {
  P as useDetails,
  q as useInfiniteRequest,
  M as useMutate
};

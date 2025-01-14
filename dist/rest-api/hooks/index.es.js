import { useInfiniteQuery as s, useMutation as p } from "@tanstack/react-query";
function f({
  queryKey: u,
  requestFn: r,
  initialRequest: a,
  options: i
}) {
  return s({
    queryKey: u,
    queryFn: ({ pageParam: t }) => r(t),
    initialPageParam: a,
    getNextPageParam: (t, o, e) => {
      var m;
      const n = ((m = t.meta) == null ? void 0 : m.perPage) ?? 10, c = e.page ?? 1;
      if (!(t.data.length < n))
        return {
          ...e,
          page: c + 1
        };
    },
    ...i
  });
}
function q({
  requestFn: u,
  options: r
}) {
  return {
    ...p({
      mutationFn: (t) => u(t),
      ...r
    }),
    createMutateRequest: (t, o, e, n) => ({
      mutate: [{
        operation: t,
        attributes: o,
        ...e !== void 0 && { key: e },
        ...n && { relations: n }
      }]
    })
  };
}
export {
  f as useInfiniteRequest,
  q as useMutateRequest
};

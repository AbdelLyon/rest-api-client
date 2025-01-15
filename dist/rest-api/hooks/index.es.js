import { useInfiniteQuery as f, useMutation as i, useQuery as p } from "@tanstack/react-query";
function F({
  queryKey: e,
  requestFn: t,
  initialRequest: n,
  options: a
}) {
  return f({
    queryKey: e,
    queryFn: ({ pageParam: u }) => t(u),
    initialPageParam: n,
    getNextPageParam: (u, s, r) => {
      var m;
      const o = ((m = u.meta) == null ? void 0 : m.perPage) ?? 10, c = r.page ?? 1;
      if (!(u.data.length < o))
        return {
          ...r,
          page: c + 1
        };
    },
    ...a
  });
}
function q({
  requestFn: e,
  options: t
}) {
  return {
    ...i({
      mutationFn: (u) => e(u),
      ...t
    }),
    createMutateRequest: (u, s, r, o) => ({
      mutate: [{
        operation: u,
        attributes: s,
        ...r !== void 0 && { key: r },
        ...o && { relations: o }
      }]
    })
  };
}
function d({
  queryKey: e,
  requestFn: t,
  options: n
}) {
  return p({
    queryKey: e,
    queryFn: t,
    ...n
  });
}
function l({
  service: e,
  options: t
}) {
  return i({
    mutationFn: (n) => e.delete(n),
    ...t
  });
}
function D({
  service: e,
  options: t
}) {
  return i({
    mutationFn: (n) => e.forceDelete(n),
    ...t
  });
}
function M({
  service: e,
  options: t
}) {
  return i({
    mutationFn: (n) => e.restore(n),
    ...t
  });
}
export {
  l as useDelete,
  d as useDetails,
  D as useForceDelete,
  F as useInfiniteRequest,
  q as useMutate,
  M as useRestore
};

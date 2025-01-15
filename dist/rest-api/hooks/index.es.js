import { useInfiniteQuery as m, useSuspenseInfiniteQuery as g, useMutation as s, useQuery as p } from "@tanstack/react-query";
function P({
  queryKey: e,
  requestFn: t,
  initialRequest: r,
  options: o
}) {
  return m({
    queryKey: e,
    queryFn: ({ pageParam: n }) => t(n),
    initialPageParam: r,
    getNextPageParam: (n, f, u) => {
      var a;
      const i = ((a = n.meta) == null ? void 0 : a.perPage) ?? 10, c = u.page ?? 1;
      if (!(n.data.length < i))
        return {
          ...u,
          page: c + 1
        };
    },
    ...o
  });
}
function d({
  queryKey: e,
  requestFn: t,
  initialRequest: r,
  options: o
}) {
  return g({
    queryKey: e,
    queryFn: ({ pageParam: n }) => t(n),
    initialPageParam: r,
    getNextPageParam: (n, f, u) => {
      var a;
      const i = ((a = n.meta) == null ? void 0 : a.perPage) ?? 10, c = u.page ?? 1;
      if (!(n.data.length < i))
        return {
          ...u,
          page: c + 1
        };
    },
    ...o
  });
}
function q({
  requestFn: e,
  options: t
}) {
  return {
    ...s({
      mutationFn: (n) => e(n),
      ...t
    }),
    createMutateRequest: (n, f, u, i) => ({
      mutate: [{
        operation: n,
        attributes: f,
        ...u !== void 0 && { key: u },
        ...i && { relations: i }
      }]
    })
  };
}
function y({
  queryKey: e,
  requestFn: t,
  options: r
}) {
  return p({
    queryKey: e,
    queryFn: t,
    ...r
  });
}
function h({
  service: e,
  options: t
}) {
  return s({
    mutationFn: (r) => e.delete(r),
    ...t
  });
}
function l({
  service: e,
  options: t
}) {
  return s({
    mutationFn: (r) => e.forceDelete(r),
    ...t
  });
}
function D({
  service: e,
  options: t
}) {
  return s({
    mutationFn: (r) => e.restore(r),
    ...t
  });
}
export {
  h as useDelete,
  y as useDetails,
  l as useForceDelete,
  P as useInfiniteSearch,
  q as useMutate,
  D as useRestore,
  d as useSuspenseInfiniteSearch
};

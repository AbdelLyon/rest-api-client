import { useInfiniteQuery as m } from "@tanstack/react-query";
import "axios";
import "axios-retry";
import { U as p } from "../../RoleService-Cy-fER5k.js";
function g({
  queryKey: t,
  requestFn: n,
  initialRequest: r,
  options: a
}) {
  return m({
    queryKey: t,
    queryFn: ({ pageParam: e = r }) => n(e),
    initialPageParam: r,
    getNextPageParam: (e, u, i) => {
      var o;
      const c = ((o = e.meta) == null ? void 0 : o.perPage) ?? 10, s = i.page ?? 1;
      if (!(!e.meta || e.data.length < c))
        return {
          ...i,
          page: s + 1
        };
    },
    ...a
  });
}
const q = ({
  domaine: t,
  pathname: n,
  search: r,
  queryKey: a,
  initialRequest: e
}) => {
  const u = p.getInstance(t, n);
  return {
    ...g({
      queryKey: a,
      requestFn: () => u.search(r),
      initialRequest: e
    })
  };
};
export {
  q as useInfinitSearchUser,
  g as useInfiniteRequest
};

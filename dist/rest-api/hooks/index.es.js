import { useInfiniteQuery as p } from "@tanstack/react-query";
import "axios";
import "axios-retry";
import { U as g } from "../../RoleService-Cy-fER5k.js";
function m({
  queryKey: r,
  requestFn: t,
  initialRequest: n,
  options: i
}) {
  return p({
    queryKey: r,
    queryFn: ({ pageParam: e }) => t(e),
    initialPageParam: n,
    getNextPageParam: (e, o, u) => {
      var s;
      const a = ((s = e.meta) == null ? void 0 : s.perPage) ?? 10, c = u.page ?? 1;
      if (!(e.data.length < a))
        return {
          ...u,
          page: c + 1
        };
    },
    ...i
  });
}
const P = ({
  domaine: r,
  pathname: t,
  search: n,
  queryKey: i,
  initialRequest: e
}) => {
  const o = g.getInstance(r, t);
  return {
    ...m({
      queryKey: i,
      requestFn: () => o.search(n),
      initialRequest: e
    })
  };
};
export {
  P as useInfinitSearchUser,
  m as useInfiniteRequest
};

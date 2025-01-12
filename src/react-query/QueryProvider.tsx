import type { QueryClientConfig } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { JSX } from "react";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const QueryProvider = ({
  children,
  config,
}: React.PropsWithChildren<{ config?: QueryClientConfig }>): JSX.Element => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        ...config,
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { JSX } from "react";
import type { QueryClientConfig } from "@tanstack/react-query";

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

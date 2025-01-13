import { JSX } from 'react';
import { QueryClientConfig } from '@tanstack/react-query';
export declare const QueryProvider: ({ children, config, }: React.PropsWithChildren<{
    config?: QueryClientConfig;
}>) => JSX.Element;

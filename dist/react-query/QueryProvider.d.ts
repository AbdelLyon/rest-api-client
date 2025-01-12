import { QueryClientConfig } from '@tanstack/react-query';
import { JSX } from 'react';
export declare const QueryProvider: ({ children, config, }: React.PropsWithChildren<{
    config?: QueryClientConfig;
}>) => JSX.Element;

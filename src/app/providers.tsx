"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState, type ReactNode } from "react";
import { ToastProvider } from "@/components/atoms/toaster";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } }));
  return (
    <QueryClientProvider client={client}>
      <NuqsAdapter>
        <ToastProvider>{children}</ToastProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}

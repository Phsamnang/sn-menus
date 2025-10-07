// app/providers.tsx
"use client"; // 👈 CRITICAL: This marks the client boundary

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";

// 1. Instantiate the QueryClient within the client component boundary
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 2. Wrap components that require client-side context/state
    <QueryClientProvider client={queryClient}>
      {children}

      {/* 3. Toaster and Analytics can also be included here */}
      <Analytics />
      <Toaster />
    </QueryClientProvider>
  );
}

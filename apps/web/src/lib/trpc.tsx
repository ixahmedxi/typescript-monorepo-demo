'use client'

import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

import { trpcReact } from '@org/api/react'

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  if (process.env['VERCEL_URL']) {
    return `https://${process.env['VERCEL_URL']}`
  }
  return `http://localhost:${String(process.env['PORT'])}`
}

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [
        httpBatchLink({
          url: getBaseUrl() + '/api/trpc',
          transformer: superjson,
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpcReact.Provider>
    </QueryClientProvider>
  )
}

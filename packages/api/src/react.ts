import { createTRPCReact } from '@trpc/react-query'

import { AppRouter } from './server'

export const trpcReact = createTRPCReact<AppRouter>()

trpcReact.router0.foo.useQuery

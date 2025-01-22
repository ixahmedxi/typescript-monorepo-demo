import type { router0001 } from '@org/router0001'
import type { createTRPCReact } from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { trpcReact } from './trpc'

type Router0001Router = typeof router0001

/**
 * These are only relevant on the root "trpc."-object
 **/
type IgnoredTypes =
  | 'Provider'
  | 'createClient'
  | 'useDehydratedState'
  | 'useContext'
  | 'useUtils'

/**
 * Alex could fix these inside tRPC if we want to use them.
 **/
type TODO_TYPES = 'useQueries' | 'useSuspenseQueries'

type Router0001Types = ReturnType<typeof createTRPCReact<Router0001Router>>

type Router0001Api = Omit<Router0001Types, IgnoredTypes | TODO_TYPES>

// biome-ignore lint/suspicious/noExplicitAny: generated
export const router0001Api = (trpcReact as any).router0001 as Router0001Api

export type Router0001Inputs = inferRouterInputs<Router0001Router>
export type Router0001Outputs = inferRouterOutputs<Router0001Router>

export const useRouter0001Utils = (): Omit<
  ReturnType<Router0001Types['useUtils']>,
  'client'
> => {
  // biome-ignore lint/suspicious/noExplicitAny: generated
  return (trpcReact as any).useUtils().router0001
}

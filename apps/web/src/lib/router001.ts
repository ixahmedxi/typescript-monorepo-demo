import type { router001 } from '@org/router001'
import type { createTRPCReact } from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { trpcReact } from './trpc'

type Router001Router = typeof router001

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

type Router001Types = ReturnType<typeof createTRPCReact<Router001Router>>

type Router001Api = Omit<Router001Types, IgnoredTypes | TODO_TYPES>

// biome-ignore lint/suspicious/noExplicitAny: generated
export const router001Api = (trpcReact as any).router001 as Router001Api

export type Router001Inputs = inferRouterInputs<Router001Router>
export type Router001Outputs = inferRouterOutputs<Router001Router>

export const useRouter001Utils = (): Omit<
  ReturnType<Router001Types['useUtils']>,
  'client'
> => {
  // biome-ignore lint/suspicious/noExplicitAny: generated
  return (trpcReact as any).useUtils().router001
}

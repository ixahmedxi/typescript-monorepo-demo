// @ts-expect-error - this is a template file

import type { __ROUTER_INSTANCE__ } from '__TS_PATH__'
import type { createTRPCReact } from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

// @ts-expect-error - this is a template file
import { trpcReact } from '../lib/trpc'

type __ROUTER_TYPE__Router = typeof __ROUTER_INSTANCE__

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

type __ROUTER_TYPE__Types = ReturnType<
  typeof createTRPCReact<__ROUTER_TYPE__Router>
>

type __ROUTER_TYPE__Api = Omit<__ROUTER_TYPE__Types, IgnoredTypes | TODO_TYPES>

// biome-ignore lint/suspicious/noExplicitAny: generated
export const __ROUTER_INSTANCE__Api = (trpcReact as any)
  .__ROUTER_INSTANCE__ as __ROUTER_TYPE__Api

export type __ROUTER_TYPE__Inputs = inferRouterInputs<__ROUTER_TYPE__Router>
export type __ROUTER_TYPE__Outputs = inferRouterOutputs<__ROUTER_TYPE__Router>

export const use__ROUTER_TYPE__Utils = (): Omit<
  ReturnType<
    // @ts-expect-error - this is a template file
    __ROUTER_TYPE__Types['useUtils']
  >,
  'client'
> => {
  // biome-ignore lint/suspicious/noExplicitAny: generated
  return (trpcReact as any).useUtils().__ROUTER_INSTANCE__
}

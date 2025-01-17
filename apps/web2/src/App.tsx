import { trpc } from './lib/trpc'

export function App() {
  const { data } = trpc.router0.foo.useQuery()

  // 1. run `bun dev`
  // 2. change `generated-routers/router0/src/index.ts` and see it update here
  return <h1>{data ?? 'Loading...'}</h1>
}

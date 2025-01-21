import { trpcReact } from './lib/trpc'

export function App() {
  const { data } = trpcReact.router01.foo.useQuery()

  if (data === 'bar') {
  }

  // 1. run `bun dev`
  // 2. change `generated-routers/router0/src/index.ts` and see it update here
  return <h1>{data ?? 'Loading...'}</h1>
}

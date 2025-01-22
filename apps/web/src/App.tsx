import { router001Api } from './generated-trpc-client/router001'

export function App() {
  const q1 = router001Api.foo.useQuery()

  if (q1.data === 'bar') {
  }

  // 1. run `bun dev`
  // 2. change `generated-routers/router0/src/index.ts` and see it update here
  return <h1>{q1.data ?? 'Loading...'}</h1>
}

import { trpc } from './lib/trpc'

export function App() {
  const { data } = trpc.router0.foo.useQuery()

  return <h1>{data ?? 'Loading...'}</h1>
}

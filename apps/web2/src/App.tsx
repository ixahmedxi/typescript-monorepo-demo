import { trpc } from './lib/trpc'

export function App() {
  const { data } =
    trpc.router45.quantum.multiverse.infiniteRecursion.recurse.useQuery({
      depth: 1,
      data: { hello: 'world' },
      callback: () => Promise.resolve(),
    })

  return <h1>{data ?? 'Loading...'}</h1>
  //           ^?
}

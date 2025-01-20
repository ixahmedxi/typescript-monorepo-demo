import { a } from '@org/a'

a.foo
// ^?

export const b = {
  a,
} as const

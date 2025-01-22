import { router } from '@org/trpc';

import { router001 } from '@org/router001';
import { router002 } from '@org/router002';
import { router003 } from '@org/router003';

export const appRouter = router({
  router001,
  router002,
  router003
});

export type AppRouter = typeof appRouter;
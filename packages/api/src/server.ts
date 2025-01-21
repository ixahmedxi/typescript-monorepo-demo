import { router } from '@org/trpc';

import { router01 } from '@org/router01';
import { router02 } from '@org/router02';
import { router03 } from '@org/router03';

export const appRouter = router({
  router01,
  router02,
  router03
});

export type AppRouter = typeof appRouter;
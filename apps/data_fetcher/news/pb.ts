import { makePBAdmin } from '@repo/lib/pb';

const pb = await makePBAdmin(Bun.env as any);

export { pb };

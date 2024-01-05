import { z } from "zod";

export const postVoteType = z.enum(['up-vote', 'down-vote']);

export type PostVoteType = z.infer<typeof postVoteType>;
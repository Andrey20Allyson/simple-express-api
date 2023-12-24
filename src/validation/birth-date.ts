import { z } from "zod";

export const birthDateSchema = z.object({
  year: z.number(),
  month: z.number(),
  day: z.number(),
});
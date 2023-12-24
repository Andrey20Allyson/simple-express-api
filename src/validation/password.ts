import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, `Password can't be smaller than 6 characters!`);
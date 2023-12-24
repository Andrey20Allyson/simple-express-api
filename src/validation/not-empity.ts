import { z } from "zod";

export const notEmpitySchema = z
  .string()
  .min(1);
import { z } from "zod";

export type NumberSchemaParams = Parameters<typeof z.number>[0];

export function numericId(params?: NumberSchemaParams) {
  return z
    .number(params)
    .min(1)
    .int();
}
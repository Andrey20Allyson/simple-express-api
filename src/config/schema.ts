import { z } from "zod";

export const configSchema = z.object({
  port: z
    .number()
    .default(8080),

  log: z.object({
    errors: z
      .boolean()
      .default(false),

  }).default({}),

  jwt: z.object({
    issuer: z
      .string()
      .default('simple-express-api'),

    keys: z
      .string()
      .default('auto'),

    lifespan: z
      .string()
      .or(z.number())
      .default("10m"),

  }).default({}),

  cors: z.object({
    allowed: z.object({
      headers: z
        .string()
        .array()
        .default([]),

    }).default({}),
    
  }).default({}),
});
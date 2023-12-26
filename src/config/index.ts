import fs from 'fs';
import { z } from 'zod';
import yaml from 'js-yaml';

const loaders: ConfigLoader[] = [
  {
    extention: 'json',
    loader: data => JSON.parse(data),
  },
  {
    extention: [
      'yml',
      'yaml',
    ],
    loader: data => yaml.load(data),
  },
];

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
});

export const config = load();

export function load() {
  const json = readConfig();

  return configSchema.parse(json);
}

export interface ConfigLoader {
  extention: string | string[],
  loader: (data: string) => unknown;
}

export function readConfig(): unknown {
  for (const { extention, loader } of loaders) {
    let extentions = extention instanceof Array ? extention : [extention]; 
    let data: string | null = null;

    for (const ext of extentions) {
      try {
        data = fs.readFileSync(`api.config.${ext}`, { encoding: 'utf-8' });
      } catch {}

      if (data !== null) {
        return loader(data);
      }
    }
  }

  console.log('default init');

  return {};
}
import fs from 'fs';
import yaml from 'js-yaml';
import { configSchema } from './schema';

export interface ConfigLoader {
  extention: string | string[],
  loader: (data: string) => unknown;
}

const loaders: ConfigLoader[] = [{
  extention: 'json',
  loader: data => JSON.parse(data),
}, {
  extention: [
    'yml',
    'yaml',
  ],
  loader: data => yaml.load(data),
}];

export function load() {
  const json = readConfig();

  return configSchema.parse(json);
}

export function readConfig(): unknown {
  for (const { extention, loader } of loaders) {
    let extentions = extention instanceof Array ? extention : [extention];
    let data: string | null = null;

    for (const ext of extentions) {
      try {
        data = fs.readFileSync(`api.config.${ext}`, { encoding: 'utf-8' });
      } catch { }

      if (data !== null) {
        return loader(data);
      }
    }
  }

  return {};
}

export const config = load();
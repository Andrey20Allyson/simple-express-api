import e, { Router } from "express";

export class ResourceConfig implements e.RouterOptions {
  caseSensitive?: boolean | undefined;
  mergeParams?: boolean | undefined;
  strict?: boolean | undefined;
  path: string = '/';
}

export type ResourceBuilder = (router: Router, config: ResourceConfig) => void;

export function resource(builder: ResourceBuilder): e.RequestHandler {
  const router = Router();
  const config = new ResourceConfig();

  builder(router, config);

  return Router(config).use(config.path, router);
}
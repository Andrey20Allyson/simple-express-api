import e, { Router } from "express";

export class ResourceConfig implements e.RouterOptions {
  caseSensitive?: boolean | undefined;
  mergeParams?: boolean | undefined;
  strict?: boolean | undefined;
  path: string = '/';
}

export type HandlerBuilderFn = (router: Router, config: ResourceConfig) => void;

export function resource(builder: HandlerBuilderFn): e.RequestHandler {
  const router = Router();
  const config = new ResourceConfig();

  builder(router, config);

  return Router(config).use(config.path, router);
}

export interface HandlerBuilder {
  build(router: Router, config: ResourceConfig): void;
}

export type HandlerBuilderClass = new () => HandlerBuilder;

resource.from = function(Constructor: HandlerBuilderClass) {
  const resource = new Constructor();

  return this(resource.build.bind(resource));
}
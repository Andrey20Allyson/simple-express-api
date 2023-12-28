import e from "express";
import { ZodRawShape, ZodType, z } from "zod";

export interface ObjectWithSchema<T = any> {
  schema: ZodType<T>;
}

export type DTO<O extends ObjectWithSchema<any>> = z.infer<O['schema']>;

export function createDTO<S extends ZodRawShape>(shape: S) {
  return {
    schema: z.object(shape),
  };
}

export function valid<B>(type: ZodType | ObjectWithSchema): e.RequestHandler {
  const schema = 'schema' in type ? type.schema : type;

  return (req, _, next) => {
    req.body = schema.parse(req.body);

    next();
  }
}

valid.query = function(type: ZodType | ObjectWithSchema): e.RequestHandler {
  const schema = 'schema' in type ? type.schema : type;

  return (req, _, next) => {
    req.query = schema.parse(req.query) as any;

    next();
  }
}
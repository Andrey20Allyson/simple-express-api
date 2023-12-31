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

/**
 * Creates a express middleware that validates the request body with `type` schema
 * 
 * @param type Schema to that validate the request body
 * @returns A express request handler that thwons if request body is invalid
 */
export function valid<B>(type: ZodType | ObjectWithSchema): e.RequestHandler {
  const schema = 'schema' in type ? type.schema : type;

  return (req, _, next) => {
    req.body = schema.parse(req.body);

    next();
  }
}

/**
 * Create a express middleware that validates request query with `type` shema
 * 
 * @param type Shema to validate the request query
 * @returns A express request handler that thowns if request query is invalid
 */
valid.query = function(type: ZodType | ObjectWithSchema): e.RequestHandler {
  const schema = 'schema' in type ? type.schema : type;

  return (req, _, next) => {
    req.query = schema.parse(req.query) as any;

    next();
  }
}
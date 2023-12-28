import e from "express";
import { ZodRawShape, ZodType, z } from "zod";

export interface ObjectWithSchema<T> {
  schema: ZodType<T>;
}

export type DTO<O extends ObjectWithSchema<any>> = z.infer<O['schema']>;

export function createDTO<S extends ZodRawShape>(shape: S) {
  return {
    schema: z.object(shape),
  };
}

export function valid<P, ResB, ReqB, ReqQ, L extends Record<string, any>>(type: ZodType<ReqB> | ObjectWithSchema<ReqB>): e.RequestHandler<P, ResB, ReqB, ReqQ, L> {
  const schema = 'schema' in type ? type.schema : type; 
  
  return (req, _, next) => {
    req.body = schema.parse(req.body);

    next();
  }
}
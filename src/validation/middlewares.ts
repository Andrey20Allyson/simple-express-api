import e from "express";
import { ZodType } from "zod";

export interface ObjectWithSchema<T> {
  schema: ZodType<T>;
}

export function valid<P, ResB, ReqB, ReqQ, L extends Record<string, any>>(type: ZodType<ReqB> | ObjectWithSchema<ReqB>): e.RequestHandler<P, ResB, ReqB, ReqQ, L> {
  const schema = 'schema' in type ? type.schema : type; 
  
  return (req, _, next) => {
    req.body = schema.parse(req.body);

    next();
  }
}
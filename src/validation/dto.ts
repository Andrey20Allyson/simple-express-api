import { ZodType, z, ZodRawShape } from "zod";

export interface ObjectWithSchema<T = any> {
  schema: ZodType<T>;
}

/**
 * Extracts the type from a DTO
 */
export type DTO<O extends ObjectWithSchema<any>> = z.infer<O['schema']>;

/**
 * Create a DTO schema that can be used to request data validation
 * 
 * @param shape 
 * @returns 
 */
export function createDTO<S extends ZodRawShape>(shape: S) {
  return {
    schema: z.object(shape),
  };
}
import { z } from "zod";
import { passwordSchema } from "../validation/password";
import { notEmpitySchema } from "../validation/not-empity";

export type SignInRequestDTO = z.infer<typeof SignInRequestDTO['schema']>;  
export namespace SignInRequestDTO {
  export const schema = z.object({
    login: notEmpitySchema,
    password: passwordSchema,
  });
}
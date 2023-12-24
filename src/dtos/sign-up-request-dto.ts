import { z } from "zod";
import { passwordSchema } from "../validation/password";
import { birthDateSchema } from "../validation/birth-date";
import { notEmpitySchema } from "../validation/not-empity";

export type SignUpRequestDTO = z.infer<typeof SignUpRequestDTO['schema']>;
export namespace SignUpRequestDTO {
  export const schema = z.object({
    name: notEmpitySchema,
    login: notEmpitySchema,
    password: passwordSchema,
    birthDate: birthDateSchema,
  });
}
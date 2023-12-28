import { dateSchema } from "../../validation/birth-date";
import { DTO, createDTO } from "../../validation/middlewares";
import { notEmpitySchema } from "../../validation/not-empity";
import { passwordSchema } from "../../validation/password";

export const SignUpRequestDTO = createDTO({
  name: notEmpitySchema,
  login: notEmpitySchema,
  password: passwordSchema,
  birthDate: dateSchema,
});

export type SignUpRequestDTO = DTO<typeof SignUpRequestDTO>;
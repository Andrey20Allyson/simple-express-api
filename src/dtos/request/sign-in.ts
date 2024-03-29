import { createDTO, DTO } from "../../validation/dto";
import { notEmpitySchema } from "../../validation/not-empity";
import { passwordSchema } from "../../validation/password";

export const SignInRequestDTO = createDTO({
  login: notEmpitySchema,
  password: passwordSchema,
});

export type SignInRequestDTO = DTO<typeof SignInRequestDTO>;
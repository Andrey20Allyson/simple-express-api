import { DTO, createDTO } from "../../validation/middlewares";
import { notEmpitySchema } from "../../validation/not-empity";

export const PostCreateDTO = createDTO({
  title: notEmpitySchema,
  content: notEmpitySchema,
});

export type PostCreateDTO = DTO<typeof PostCreateDTO>;
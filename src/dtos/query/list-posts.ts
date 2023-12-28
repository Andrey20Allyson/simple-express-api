import { z } from "zod";
import { DTO, createDTO } from "../../validation/middlewares";

export const ListPostQuery = createDTO({
  authorId: z
    .number({ coerce: true })
    .optional()
});

export type ListPostQuery = DTO<typeof ListPostQuery>;
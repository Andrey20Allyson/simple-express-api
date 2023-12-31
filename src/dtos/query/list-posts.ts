import { z } from "zod";
import { createDTO, DTO } from "../../validation/dto";

export const ListPostQuery = createDTO({
  authorId: z
    .number({ coerce: true })
    .optional()
});

export type ListPostQuery = DTO<typeof ListPostQuery>;
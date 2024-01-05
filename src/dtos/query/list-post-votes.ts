import { z } from "zod";
import { createDTO, DTO } from "../../validation/dto";
import { numericId } from "../../validation/identificator";

export const ListPostVoteQuery = createDTO({
  ownerId: numericId({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
  pageSize: z.number({ coerce: true }).optional(),
  postId: numericId({ coerce: true }).optional(), 
  postAuthorId: numericId({ coerce: true }).optional(),
});

export type ListPostVoteQuery = DTO<typeof ListPostVoteQuery>;
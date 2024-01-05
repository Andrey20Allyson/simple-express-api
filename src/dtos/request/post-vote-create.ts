import { createDTO, DTO } from "../../validation/dto";
import { numericId } from "../../validation/identificator";
import { postVoteType } from "../../validation/post-vote";

export const PostVoteCreateDTO = createDTO({
  postId: numericId(),
  type: postVoteType,
});

export type PostVoteCreateDTO = DTO<typeof PostVoteCreateDTO>;
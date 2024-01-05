import { PostVote } from "@prisma/client";
import { PostVoteType } from "../../validation/post-vote";
import { postVoteDBTypeToDTOType } from "../utils/post-vote";

export class PostVoteResponseDTO {
  constructor(
    readonly id: number,
    readonly postId: number,
    readonly ownerId: number,
    readonly type: PostVoteType,
  ) { }

  static from(model: PostVote): PostVoteResponseDTO {
    return new PostVoteResponseDTO(
      model.id,
      model.postId,
      model.postId,
      postVoteDBTypeToDTOType(model.type),
    );
  }
}
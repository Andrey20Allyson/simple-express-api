import { PostVoteDBType } from "../../repositories/post-vote-repository";
import { PostVoteType } from "../../validation/post-vote";

export function postVoteDTOTypeToDBType(dtoType: PostVoteType): PostVoteDBType {
  switch (dtoType) {
    case "up-vote":
      return PostVoteDBType.UP_VOTE;
    case "down-vote":
      return PostVoteDBType.DOWN_VOTE;
    default:
      throw new Error(`unexpected behavior, recived ${dtoType}`);
  }
}

export function postVoteDBTypeToDTOType(dbType: PostVoteDBType): PostVoteType {
  switch (dbType) {
    case PostVoteDBType.DOWN_VOTE:
      return 'down-vote';
    case PostVoteDBType.UP_VOTE:
      return 'up-vote';
    default:
      throw new Error(`unexpected behavior, recived ${dbType}`);
  }
}

import { PostVote, PrismaClient } from "@prisma/client"
import { ModelInitType, prisma } from "../prisma";

export interface IPostVoteRepository {
  
}

export type PostVoteCRUD = PrismaClient['postVote'];
export type PostVoteInit = ModelInitType<PostVoteCRUD>;

export interface PostVoteRepositoryOptions {
  crud?: PostVoteCRUD;
}

export class PostVoteRepository {
  crud: PostVoteCRUD;

  constructor(options: PostVoteRepositoryOptions = {}) {
    this.crud = options.crud ?? prisma.postVote;
  }

  listByPost(postId: number): Promise<PostVote[]> {
    return this.crud.findMany({
      where: {
        postId,
      },
    });
  }

  listByAuthor(authorId: number): Promise<PostVote[]> {
    return this.crud.findMany({
      where: {
        post: {
          authorId,
        }
      }
    });
  }

  persist(postVote: PostVoteInit): Promise<PostVote> {
    return this.crud.create({ data: postVote });
  }
}
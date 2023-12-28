import { PostVote, PrismaClient } from "@prisma/client"
import { ModelInitType, prisma } from "../prisma";

export enum PostVoteType {
  DOWN_VOTE = 1,
  UP_VOTE,
}

export interface IPostVoteRepository {
  listByPost(postId: number): Promise<PostVote[]>;
  listByAuthor(authorId: number): Promise<PostVote[]>;
  persist(postVote: PostVoteInit): Promise<PostVote>;
  countByPost(postId: number, type?: PostVoteType): Promise<number>;
}

export type PostVoteCRUD = PrismaClient['postVote'];
export type PostVoteInit = ModelInitType<PostVoteCRUD>;

export interface PostVoteRepositoryOptions {
  crud?: PostVoteCRUD;
}

export class PostVoteRepository implements IPostVoteRepository {
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

  countByPost(postId: number, type?: PostVoteType): Promise<number> {
    return this.crud.count({
      where: {
        postId,
        type
      },
    });
  }

  persist(postVote: PostVoteInit): Promise<PostVote> {
    return this.crud.create({ data: postVote });
  }

  delete(id: number): Promise<PostVote> {
    return this.crud.delete({ where: { id } });
  }
}
import { PostVote, PrismaClient } from "@prisma/client"
import { ModelInitType, prisma } from "../prisma";

export enum PostVoteDBType {
  DOWN_VOTE = 1,
  UP_VOTE,
}

export interface ListPostVoteByPostOptions {
  id?: number;
  authorId?: number;
}

export interface ListPostVoteOptions {
  page?: number;
  pageSize?: number;
  ownerId?: number;
  type?: PostVoteDBType;
  post?: ListPostVoteByPostOptions;
}

export interface IPostVoteRepository {
  list(options?: ListPostVoteOptions): Promise<PostVote[]>;
  persist(postVote: PostVoteInit): Promise<PostVote>;
  delete(id: number): Promise<PostVote>;
  countByPost(postId: number, type?: PostVoteDBType): Promise<number>;
}

export type PostVoteCRUD = PrismaClient['postVote'];
export type PostVoteInit = ModelInitType<PostVoteCRUD>;

export interface PostVoteRepositoryOptions {
  crud?: PostVoteCRUD;
  defaultPageSize?: number;
}

export class PostVoteRepository implements IPostVoteRepository {
  readonly crud: PostVoteCRUD;
  readonly defaultPageSize: number;

  constructor(options: PostVoteRepositoryOptions = {}) {
    this.crud = options.crud ?? prisma.postVote;
    this.defaultPageSize = options.defaultPageSize ?? 10;
  }

  list(options?: ListPostVoteOptions): Promise<PostVote[]> {
    const pageSize = options?.page !== undefined ? options.pageSize ?? this.defaultPageSize : undefined;
    const skip = options?.page !== undefined && pageSize !== undefined
      ? options.page * pageSize
      : undefined;

    return this.crud.findMany({
      where: {
        ownerId: options?.ownerId,
        post: {
          id: options?.post?.id,
          authorId: options?.post?.authorId,
        },
        type: options?.type,
      },
      take: pageSize,
      skip,
    });
  }

  countByPost(postId: number, type?: PostVoteDBType): Promise<number> {
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
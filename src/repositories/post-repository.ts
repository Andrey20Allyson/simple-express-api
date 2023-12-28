import { Post, PrismaClient } from "@prisma/client";
import { ModelInitType, prisma } from "../prisma";

export type PostCRUD = PrismaClient['post'];
export type PostInit = ModelInitType<PostCRUD>;

export interface ListPostOptions {
  authorId?: number;
}

export interface IPostRepository {
  findById(id: number): Promise<Post | null>;
  list(options?: ListPostOptions): Promise<Post[]>;
  persist(post: PostInit): Promise<Post>;
  delete(id: number): Promise<Post>;
}

export interface PostRepositoryOptions {
  crud?: PostCRUD;
}

export class PostRepository implements IPostRepository {
  private crud: PostCRUD;

  constructor(options: PostRepositoryOptions = {}) {
    this.crud = options.crud ?? prisma.post;
  }

  findById(id: number): Promise<Post | null> {
    return this.crud.findUnique({ where: { id } });
  }

  list(options: ListPostOptions = {}): Promise<Post[]> {
    return this.crud.findMany({
      where: {
        authorId: options.authorId,
      }
    });
  }

  persist(post: PostInit): Promise<Post> {
    return this.crud.create({ data: post });
  }

  delete(id: number): Promise<Post> {
    return this.crud.delete({ where: { id } });
  }
}
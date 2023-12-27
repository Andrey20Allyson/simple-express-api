import { Post, PrismaClient } from "@prisma/client";
import { ModelInitType, prisma } from "../prisma";

export type PostCRUD = PrismaClient['post'];
export type PostInit = ModelInitType<PostCRUD>;

export interface IPostRepository {
  findById(id: number): Promise<Post | null>;
  listByAuthor(userId: number): Promise<Post[]>;
  list(): Promise<Post[]>;
  persist(post: PostInit): Promise<Post>;
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

  listByAuthor(authorId: number): Promise<Post[]> {
    return this.crud.findMany({
      where: {
        authorId,
      },
    });
  }

  list(): Promise<Post[]> {
    return this.crud.findMany();
  }

  persist(post: PostInit): Promise<Post> {
    return this.crud.create({ data: post });
  }
}
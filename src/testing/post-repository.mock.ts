import { Post } from "@prisma/client";
import { IPostRepository, ListPostOptions, PostInit } from "../repositories/post-repository";

export class PostRepositoryMock implements IPostRepository {
  data: Post[] = [];
  idCount = 1;

  async findById(id: number): Promise<Post | null> {
    return this.data.find(post => post.id === id) ?? null;
  }

  async list(options: ListPostOptions = {}): Promise<Post[]> {
    return Array
      .from(this.data)
      .filter(post => options.authorId !== undefined ? post.authorId === options.authorId : true);
  }

  async persist(post: PostInit): Promise<Post> {
    const createdPost: Post = {
      authorId: post.authorId ?? 0,
      content: post.content,
      createdAt: new Date(),
      id: this.idCount++,
      title: post.title,
    };

    this.data.push(createdPost);

    return createdPost;
  }

  async delete(id: number): Promise<Post> {
    const idx = this.data.findIndex(post => post.id === id);
    const [post] = this.data.splice(idx, 1);

    return post;
  }
}
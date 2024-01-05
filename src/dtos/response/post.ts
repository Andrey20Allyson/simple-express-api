import { Post } from "@prisma/client";

export class PostResponseDTO {
  constructor(
    readonly id: number,
    readonly title: String,
    readonly content: String,
    readonly publishedAt: Date,
    readonly authorId: number,
  ) { }

  static from(post: Post) {
    return new PostResponseDTO(
      post.id,
      post.title,
      post.content,
      post.createdAt,
      post.authorId,
    );
  }
}
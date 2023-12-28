import { Post } from "@prisma/client";

export class PostResponseDTO {
  constructor(
    readonly title: String,
    readonly content: String,
    readonly authorId: number,
  ) { }

  static from(post: Post) {
    return new PostResponseDTO(
      post.title,
      post.content,
      post.authorId,
    );
  }
}
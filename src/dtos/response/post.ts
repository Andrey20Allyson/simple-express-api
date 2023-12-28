import { Post } from "@prisma/client";

export class PostResponseDTO {
  constructor(
    readonly title: String,
    readonly content: String,
    readonly vote: number,
  ) { }

  static from(post: Post, vote: number) {
    return new PostResponseDTO(
      post.title,
      post.content,
      vote,
    );
  }
}
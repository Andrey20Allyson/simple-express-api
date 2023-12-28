import { JWTInfo } from "../auth/request-jwt";
import { PostCreateDTO } from "../dtos/request/post-create";
import { PostResponseDTO } from "../dtos/response/post";
import { NotFoundError } from "../errors/not-found";
import { UnauthorizedError } from "../errors/unauthorized";
import { WebApplicationError } from "../errors/web-error";
import { IPostRepository, ListPostOptions, PostRepository } from "../repositories/post-repository";

export interface IPostService {
  list(options?: ListPostOptions): Promise<PostResponseDTO[]>;
  get(id: number): Promise<PostResponseDTO>;
  create(authorId: number, post: PostCreateDTO): Promise<PostResponseDTO>;
  delete(id: number): Promise<void>
  writeAccess(id: number, jwt: JWTInfo): Promise<WebApplicationError | null>;
}

export interface PostServiceOptions {
  postRepository?: IPostRepository;
}

export class PostService implements IPostService {
  private postRepository: IPostRepository;

  constructor(options: PostServiceOptions = {}) {
    this.postRepository = options.postRepository ?? new PostRepository();
  }

  async list(options?: ListPostOptions): Promise<PostResponseDTO[]> {
    const posts = await this.postRepository.list(options);

    return posts.map(post => PostResponseDTO.from(post));
  }

  async get(id: number): Promise<PostResponseDTO> {
    const post = await this.postRepository.findById(id);
    if (post === null) {
      throw new NotFoundError();
    }

    return PostResponseDTO.from(post);
  }

  async create(authorId: number, post: PostCreateDTO): Promise<PostResponseDTO> {
    const model = await this.postRepository.persist({
      content: post.content,
      title: post.title,
      authorId,
    });

    return PostResponseDTO.from(model);
  }

  async writeAccess(id: number, jwt: JWTInfo): Promise<WebApplicationError | null> {
    const user = jwt.payload();
    const post = await this.postRepository.findById(id);
    if (post === null) {
      return new NotFoundError();
    }

    const isAdmin = user.roles.includes('admin');
    if (isAdmin) return null;

    if (post.authorId !== user.id) {
      return new UnauthorizedError(`Can't do 'write' in a post of other user!`);
    }

    return null;
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
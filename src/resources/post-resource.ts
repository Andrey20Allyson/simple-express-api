import e, { Router } from "express";
import { authorized } from "../auth/middlewares";
import { JWTInfo } from "../auth/request-jwt";
import { ListPostQuery } from "../dtos/query/list-posts";
import { PostCreateDTO } from "../dtos/request/post-create";
import { PostResponseDTO } from "../dtos/response/post";
import { IPostService, PostService } from "../services/post-service";
import { valid } from "../validation/middlewares";
import { validNumber } from "../validation/number";
import { HandlerBuilder, ResourceConfig } from "./base/factory";
import { IResponse } from "./base/response";

export interface PostResourceOptions {
  postService?: IPostService;
}

export class PostResource implements HandlerBuilder {
  private postService: IPostService;

  constructor(options: PostResourceOptions = {}) {
    this.postService = options.postService ?? new PostService();
  }

  async get(id: number, res: IResponse<PostResponseDTO>) {
    const post = await this.postService.get(id);

    res.json(post);
  }

  async list(query: ListPostQuery, res: IResponse<PostResponseDTO[]>) {
    const posts = await this.postService.list({ authorId: query.authorId });

    res.json(posts);
  }

  async create(post: PostCreateDTO, jwt: JWTInfo, res: IResponse<PostResponseDTO>) {
    const author = jwt.payload();
    const createdPost = await this.postService.create(author.id, post);

    return res.status(201).json(createdPost);
  }

  async delete(id: number, jwt: JWTInfo, res: IResponse) {
    const accessError = await this.postService.writeAccess(id, jwt);
    if (accessError !== null) throw accessError;

    this.postService.delete(id);

    res
      .status(200)
      .end();
  }

  build(router: Router, config: ResourceConfig): void {
    config.path = '/posts';

    router.get('/:id', asyncHandler((req, res) => this.get(
      validNumber.parse(req.params.id),
      res,
    )));

    router.get('/',
      valid.query(ListPostQuery),
      asyncHandler((req, res) => this.list(req.query, res)),
    );

    router.post('/',
      authorized(),
      valid(PostCreateDTO),
      asyncHandler((req, res) => this.create(
        req.body,
        new JWTInfo(req),
        res,
      )),
    );

    router.delete('/:id',
      authorized(),
      asyncHandler((req, res) => this.delete(
        validNumber.parse(req.params.id),
        new JWTInfo(req),
        res,
      )),
    );
  }
}

function asyncHandler(handler: e.RequestHandler): e.RequestHandler {
  return (req, res, next) => {
    Promise
      .resolve(handler(req, res, next))
      .catch(next);
  };
}
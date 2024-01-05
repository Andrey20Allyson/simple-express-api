import { Router } from "express";
import { HandlerBuilder, ResourceConfig } from "./base/factory";
import { IPostVoteService } from "../services/post-vote-service";
import { ListPostVoteQuery } from "../dtos/query/list-post-votes";
import { IResponse } from "./base/response";
import { PostVoteResponseDTO } from "../dtos/response/post-vote";
import { PostVoteCreateDTO } from "../dtos/request/post-vote-create";
import { JWTInfo } from "../auth/request-jwt";
import { valid } from "../validation/middlewares";
import { PostVoteCountResponseDTO } from "../dtos/response/post-vote-count";
import { authorized } from "../auth/middlewares";
import { numericId } from "../validation/identificator";

export interface PostVoteResourceOptions {
  postVoteService: IPostVoteService;
}

export class PostVoteResource implements HandlerBuilder {
  constructor() {

  }

  async list(query: ListPostVoteQuery, res: IResponse<PostVoteResponseDTO[]>) {

  }

  async count(postId: number, res: IResponse<PostVoteCountResponseDTO>) {

  }

  async create(data: PostVoteCreateDTO, jwt: JWTInfo, res: IResponse<PostVoteCreateDTO>) {

  }

  async delete(id: number, jwt: JWTInfo, res: IResponse) {

  }

  build(router: Router, config: ResourceConfig): void {
    config.path = '/post-vote';

    router.get(
      '/',
      valid.query(ListPostVoteQuery),
      (req, res) => this.list(req.query, res),
    );

    router.delete(
      '/:id',
      authorized(),
      (req, res) => this.delete(
        numericId({ coerce: true }).parse(req.params.id),
        new JWTInfo(req),
        res,
      ),
    );

    router.post(
      '/',
      authorized(),
      valid(PostVoteCreateDTO),
      (req, res) => this.create(
        req.body,
        new JWTInfo(req),
        res
      ),
    );
  }
}
import { Router } from "express";
import { HandlerBuilder, ResourceConfig } from "./base/factory";
import { IResponse } from "./base/response";
import { PostResponseDTO } from "../dtos/response/post";
import { PostCreateDTO } from "../dtos/request/post-create";
import { JWTInfo } from "../auth/request-jwt";

export class PostResource implements HandlerBuilder {
  get(id: number, res: IResponse<PostResponseDTO>) {

  }

  list(res: IResponse<PostResponseDTO>) {

  }

  create(jwt: JWTInfo, post: PostCreateDTO, res: IResponse<PostResponseDTO>) {

  }
  
  build(router: Router, config: ResourceConfig): void {
  
  }
} 
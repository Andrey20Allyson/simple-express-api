import { Router } from "express";
import { authorized } from "../auth/middlewares";
import { UserResponseDTO } from "../dtos/response/user";
import { IUserService, UserService } from "../services/user-service";
import { validNumber } from "../validation/number";
import { HandlerBuilder, ResourceConfig } from "./base/factory";
import { IResponse } from "./base/response";

export interface UserResourceOptions {
  userService?: IUserService;
}

export class UserResource implements HandlerBuilder {
  private userService: IUserService;

  constructor(options: UserResourceOptions = {}) {
    this.userService = options.userService ?? new UserService();
  }

  async get(id: number, res: IResponse<UserResponseDTO>) {
    const user = await this.userService.get(id);

    res.json(user);
  }

  async list(res: IResponse<UserResponseDTO[]>) {
    const users = await this.userService.list();

    res.json(users);
  }

  build(router: Router, config: ResourceConfig): void {
    config.path = '/users';

    router.get('/',
      authorized(),
      (_, res) => this.list(res),
    );

    router.get('/:id',
      authorized({ roles: ['user'] }),
      (req, res) => this.get(
        validNumber.parse(req.params.id),
        res
      ),
    );
  }
}
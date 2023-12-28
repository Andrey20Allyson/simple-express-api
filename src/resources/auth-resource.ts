import e from "express";
import { authorized } from "../auth/middlewares";
import { JWTInfo } from "../auth/request-jwt";
import { SignInRequestDTO } from "../dtos/request/sign-in";
import { SignUpRequestDTO } from "../dtos/request/sign-up";
import { UserResponseDTO } from "../dtos/response/user";
import { AuthService, IAuthService } from "../services/auth-service";
import { IUserService, UserService } from "../services/user-service";
import { valid } from "../validation/middlewares";
import { HandlerBuilder, ResourceConfig } from "./base/factory";
import { IResponse } from "./base/response";

export interface AuthResourceOptions {
  userService?: IUserService;
  authService?: IAuthService;
}

export class AuthResource implements HandlerBuilder {
  private userService: IUserService;
  private authService: IAuthService;

  constructor(options: AuthResourceOptions = {}) {
    this.userService = options.userService ?? new UserService();
    this.authService = options.authService ?? new AuthService();
  }

  async getInfo(jwt: JWTInfo, res: IResponse<UserResponseDTO>) {
    const { id } = jwt.payload();
    const user = await this.userService.get(id);

    return res.json(user);
  }

  async signIn(data: SignInRequestDTO, res: IResponse) {
    const token = await this.authService.signIn(data);

    res.send(token);
  }

  async signUp(data: SignUpRequestDTO, res: IResponse) {
    const token = await this.authService.signUp(data);

    res
      .status(201)
      .send(token);
  }

  build(router: e.Router, config: ResourceConfig): void {
    config.path = '/auth';

    router.get('/',
      authorized(),
      (req, res) => this.getInfo(new JWTInfo(req), res),
    );

    router.get('/sign-in',
      valid(SignInRequestDTO),
      (req, res) => this.signIn(req.body, res),
    );

    router.get('/sign-up',
      valid(SignUpRequestDTO),
      (req, res) => this.signUp(req.body, res),
    );
  }
}
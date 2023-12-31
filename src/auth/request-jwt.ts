import { UnauthorizedError } from "../errors/unauthorized";
import { UserPayload } from "../services/jwt-service";

export interface JWTContainer {
  [JWTInfo.JWT_PAYLOAD]: UserPayload;
};

export class JWTInfo {
  static readonly JWT_PAYLOAD = Symbol();

  constructor(private readonly container: JWTContainer | {}) { }

  payload(): UserPayload {
    if (JWTInfo.JWT_PAYLOAD in this.container === false) {
      throw new UnauthorizedError();
    }

    return this.container[JWTInfo.JWT_PAYLOAD];
  }

  set(payload: UserPayload) {
    const container = this.container as JWTContainer;

    container[JWTInfo.JWT_PAYLOAD] = payload;

    return this;
  }

  static fromPayload(payload: UserPayload) {
    return new this({ [this.JWT_PAYLOAD]: payload });
  }
}
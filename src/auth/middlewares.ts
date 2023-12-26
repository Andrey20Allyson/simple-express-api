import e from "express";
import { UserPayload, JWTService } from "../services/jwt-service";
import { UnauthorizedError } from "../errors/unauthorized";
import { JWTInfo } from "./request-jwt";

export interface AuthorizedOptions {
  roles?: string[];
}

export function authorized(options: AuthorizedOptions = {}): e.RequestHandler {
  const jwtService = new JWTService();

  const {
    roles = [],
  } = options;

  return (req, _, next) => {
    const authorization = req.header('Authorization');
    if (authorization === undefined) return next(new UnauthorizedError());

    let user: UserPayload | null = null;

    if (authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '');

      user = jwtService.verify(token);
    }

    if (user === null) {
      return next(new UnauthorizedError());
    }

    for (const role in roles) {
      if (!user.roles.includes(role)) return next(new UnauthorizedError());
    }

    new JWTInfo(req)
      .set(user);

    return next();
  }
}
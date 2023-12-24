import e from "express";
import { UnauthorizedError } from "../errors/unauthorized";
import { UserPayload, JWTService } from "../services/jwt-service";

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
    if (authorization === undefined) throw new UnauthorizedError();

    let user: UserPayload | null = null;

    if (authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '');

      user = jwtService.verify(token);
    }
    
    if (user === null) {
      throw new UnauthorizedError();
    }
    
    for (const role in roles) {
      if (!user.roles.includes(role)) throw new UnauthorizedError();
    }

    return next();
  }
}
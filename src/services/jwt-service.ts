import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { privateKey, publicKey } from "../keys/jwt";
import { z } from "zod";
import { config } from "../config";

export const userPayloadSchema = z.object({
  id: z.number(),
  name: z.string(),
  roles: z
    .string()
    .array(),
});

export type UserPayload = z.infer<typeof userPayloadSchema>;

export class JWTService {
  readonly ISSUER = config.jwt.issuer;
  readonly LIFESPAN = config.jwt.lifespan;

  tokenOf(user: User): string {
    const payload = {
      id: user.id,
      name: user.name,
      roles: user.roles.split(';'),
    } satisfies UserPayload;

    return jwt.sign(payload, privateKey, {
      issuer: this.ISSUER,
      expiresIn: this.LIFESPAN,
      algorithm: 'RS256'
    });
  }

  verify(token: string): UserPayload {
    const payload = jwt.verify(token.replace('Bearer ', ''), publicKey, {
      issuer: this.ISSUER,
    });

    return userPayloadSchema.parse(payload);
  }
}
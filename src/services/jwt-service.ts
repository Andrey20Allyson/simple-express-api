import jwt from "jsonwebtoken";
import { UserModel } from "../models/user-model";
import { privateKey, publicKey } from "../keys/jwt";
import { z } from "zod";

export const userPayloadSchema = z.object({
  id: z.number(),
  name: z.string(),
  roles: z
    .string()
    .array(),
});

export type UserPayload = z.infer<typeof userPayloadSchema>;

export class JWTService {
  tokenOf(user: UserModel): string {
    const payload = {
      id: user.id,
      name: user.name,
      roles: user.roles,
    } satisfies UserPayload;

    return jwt.sign(payload, privateKey, {
      issuer: 'simple-express-api',
      expiresIn: '5m',
      algorithm: 'RS256'
    });
  }

  verify(token: string): UserPayload {
    const payload = jwt.verify(token.replace('Bearer ', ''), publicKey, {
      issuer: 'simple-express-api',
    });

    return userPayloadSchema.parse(payload);
  }
}
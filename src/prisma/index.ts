import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export interface Creator<I = any, T = any> {
  create(args: { data: I }): T;
}

export type ModelInitType<C extends Creator> = C extends Creator<infer I> ? I : never;
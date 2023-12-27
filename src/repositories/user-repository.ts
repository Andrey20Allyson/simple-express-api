import { PrismaClient, User } from "@prisma/client";
import { ModelInitType, prisma } from "../prisma";

export type UserCRUD = PrismaClient['user'];
export type UserInit = ModelInitType<UserCRUD>;

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  list(): Promise<User[]>;
  findByLogin(login: string): Promise<User | null>;
  isLoginInUse(login: string): boolean;
  persist(user: UserInit): Promise<User>;
}

export interface UserRepositoryOptions {
  crud?: UserCRUD;
}

export class UserRepository implements IUserRepository {
  private crud: UserCRUD;

  constructor(options: UserRepositoryOptions = {}) {
    this.crud = options.crud ?? prisma.user;
  }

  findById(id: number): Promise<User | null> {
    return this.crud.findUnique({ where: { id } });
  }

  list(): Promise<User[]> {
    return this.crud.findMany();
  }

  findByLogin(login: string): Promise<User | null> {
    return this.crud.findUnique({ where: { login } });
  }

  isLoginInUse(login: string): boolean {
    return this.findByLogin(login) !== null;
  }

  persist(user: UserInit): Promise<User> {
    return this.crud.create({ data: user });
  }
}
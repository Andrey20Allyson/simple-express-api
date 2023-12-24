import { UserModel } from "../models/user-model";
import bcrypt from 'bcryptjs';

const data: UserModel[] = [
  {
    id: 1,
    name: 'José Mario',
    birthDate: new Date(1995, 4, 5),
    createdAt: new Date(),
    login: 'jose_mario',
    passwordHash: bcrypt.hashSync('senha-123', 10),
    roles: ['user'],
  },
  {
    id: 2,
    name: 'Maria José',
    birthDate: new Date(2001, 7, 12),
    createdAt: new Date(),
    login: 'maria_jose',
    passwordHash: bcrypt.hashSync('123456', 10),
    roles: ['user', 'admin'],
  }
];

export class UserRepository {
  private users: UserModel[] = data;
  private idCount: number;

  constructor() {
    this.idCount = this.users.reduce((prev, user) => Math.max(prev, user.id), 0) + 1;
  }

  findById(id: number): UserModel | null {
    return this.users.find(user => user.id === id) ?? null;
  }

  list() {
    return this.users;
  }

  findByLogin(login: string): UserModel | null {
    return this.users.find(user => user.login === login) ?? null;
  }

  isLoginInUse(login: string) {
    return this.findByLogin(login) !== null;
  }

  /**@mutates user*/
  private addId(user: UserModel): UserModel {
    if (user.id !== 0) return user;

    user.id = this.idCount++;

    return user;
  }

  persist(user: UserModel) {
    this.addId(user);

    this.users.push(user);

    return this;
  }
}
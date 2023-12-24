export class UserModel {
  public id: number = 0;

  constructor(
    public name: string,
    public birthDate: Date,
    public login: string,
    public passwordHash: string,
    public roles: string[],
    public createdAt: Date,
  ) { }
}
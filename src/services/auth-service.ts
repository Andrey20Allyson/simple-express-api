import bcrypt from 'bcryptjs';
import { SignInRequestDTO } from "../dtos/request/sign-in";
import { SignUpRequestDTO } from "../dtos/request/sign-up";
import { UnauthorizedError } from "../errors/unauthorized";
import { UserInit, UserRepository } from "../repositories/user-repository";
import { JWTService } from "./jwt-service";

export interface IAuthService {
  signIn(data: SignInRequestDTO): Promise<string>;
  signUp(data: SignUpRequestDTO): Promise<string>;
} 

export class AuthService {
  readonly jwtService: JWTService = new JWTService();
  readonly repository: UserRepository = new UserRepository();

  async signIn(data: SignInRequestDTO): Promise<string> {
    const model = await this.repository.findByLogin(data.login);
    if (model === null) throw new UnauthorizedError();

    const passwordMatches = bcrypt.compareSync(data.password, model.passwordHash);
    if (!passwordMatches) throw new UnauthorizedError();

    return this.jwtService.tokenOf(model);
  }

  async signUp(data: SignUpRequestDTO): Promise<string> {
    const passwordHash = bcrypt.hashSync(data.password);

    const userInit: UserInit = {
      name: data.name,
      birthDate: new Date(
        data.birthDate.year,
        data.birthDate.month,
        data.birthDate.day,
      ),
      login: data.login,
      passwordHash: passwordHash,
      roles: 'user',
    };

    const user = await this.repository.persist(userInit);

    return this.jwtService.tokenOf(user);
  }
}
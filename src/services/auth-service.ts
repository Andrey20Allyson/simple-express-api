import bcrypt from 'bcryptjs';
import { SignInRequestDTO } from "../dtos/request/sign-in";
import { SignUpRequestDTO } from "../dtos/request/sign-up";
import { UnauthorizedError } from "../errors/unauthorized";
import { UserInit, UserRepository } from "../repositories/user-repository";
import { JWTService } from "./jwt-service";
import { AuthResponseDTO } from '../dtos/response/auth';

export interface IAuthService {
  signIn(data: SignInRequestDTO): Promise<AuthResponseDTO>;
  signUp(data: SignUpRequestDTO): Promise<AuthResponseDTO>;
} 

export class AuthService implements IAuthService {
  readonly jwtService: JWTService = new JWTService();
  readonly repository: UserRepository = new UserRepository();

  async signIn(data: SignInRequestDTO): Promise<AuthResponseDTO> {
    const model = await this.repository.findByLogin(data.login);
    if (model === null) throw new UnauthorizedError();

    const passwordMatches = bcrypt.compareSync(data.password, model.passwordHash);
    if (!passwordMatches) throw new UnauthorizedError();

    const tokenString = this.jwtService.tokenOf(model);

    return new AuthResponseDTO(tokenString);
  }

  async signUp(data: SignUpRequestDTO): Promise<AuthResponseDTO> {
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

    const tokenString = this.jwtService.tokenOf(user);
  
    return new AuthResponseDTO(tokenString);
  }
}
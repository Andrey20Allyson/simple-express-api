import { SignInRequestDTO } from "../dtos/sign-in-request-dto";
import { SignUpRequestDTO } from "../dtos/sign-up-request-dto";
import { UnauthorizedError } from "../errors/unauthorized";
import { UserModel } from "../models/user-model";
import { UserRepository } from "../repositories/user-repository";
import { JWTService } from "./jwt-service";
import bcrypt from 'bcryptjs';

export class AuthService {
  readonly jwtService: JWTService = new JWTService();
  readonly repository: UserRepository = new UserRepository();

  signIn(data: SignInRequestDTO): string {
    const model = this.repository.findByLogin(data.login);
    if (model === null) throw new UnauthorizedError();

    const passwordMatches = bcrypt.compareSync(data.password, model.passwordHash); 
    if (!passwordMatches) throw new UnauthorizedError(); 


    return this.jwtService.tokenOf(model);
  }

  signUp(data: SignUpRequestDTO): string {
    const passwordHash = bcrypt.hashSync(data.password);

    const model = new UserModel(
      data.name,
      new Date(
        data.birthDate.year,
        data.birthDate.month,
        data.birthDate.day,
      ),
      data.login,
      passwordHash,
      ['user'],
      new Date(),
    );

    this.repository.persist(model);

    return this.jwtService.tokenOf(model);
  }
}
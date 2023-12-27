import { UserResponseDTO } from "../dtos/user-response-dto";
import { NotFoundError } from "../errors/not-found";
import { IUserRepository, UserRepository } from "../repositories/user-repository";

export interface IUserService {
  getAll(): Promise<UserResponseDTO[]>;
  get(id: number): Promise<UserResponseDTO>;
}

export interface UserServiceOptions {
  userRepository?: IUserRepository;
}

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(options: UserServiceOptions = {}) {
    this.userRepository = options.userRepository ?? new UserRepository();
  }

  async getAll(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.list();

    return users.map(user => UserResponseDTO.from(user));
  }

  async get(id: number): Promise<UserResponseDTO> {
    const model = await this.userRepository.findById(id);
    if (model === null) throw new NotFoundError(`Can't find user with id ${id}!`);

    return UserResponseDTO.from(model);
  }
}
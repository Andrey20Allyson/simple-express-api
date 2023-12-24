import { UserResponseDTO } from "../dtos/user-response-dto";
import { NotFoundError } from "../errors/not-found";
import { UserRepository } from "../repositories/user-repository";

export class UserService {
  repository: UserRepository = new UserRepository();

  getAll() {
    return this
      .repository
      .list()
      .map(model => UserResponseDTO.from(model));
  }

  get(id: number) {
    const model = this.repository.findById(id);
    if (model === null) throw new NotFoundError(`Can't find user with id ${id}!`);

    return UserResponseDTO.from(model);
  }
}
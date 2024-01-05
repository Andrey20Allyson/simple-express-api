import { PostVoteCreateDTO } from "../dtos/request/post-vote-create";
import { PostVoteResponseDTO } from "../dtos/response/post-vote";
import { postVoteDTOTypeToDBType } from "../dtos/utils/post-vote";
import { IPostVoteRepository, ListPostVoteOptions, PostVoteInit, PostVoteRepository } from "../repositories/post-vote-repository";

export interface IPostVoteService {
  list(options: ListPostVoteOptions): Promise<PostVoteResponseDTO[]>;
  create(ownerId: number, data: PostVoteCreateDTO): Promise<PostVoteResponseDTO>;
  delete(id: number): Promise<void>;
}

export interface PostVoteServiceOptions {
  postVoteRepository: IPostVoteRepository;
}

export class PostVoteService implements IPostVoteService {
  readonly postVoteRepository: IPostVoteRepository;
  
  constructor(options?: PostVoteServiceOptions) {
    this.postVoteRepository = options?.postVoteRepository ?? new PostVoteRepository();
  }

  async create(ownerId: number, data: PostVoteCreateDTO): Promise<PostVoteResponseDTO> {
    const modelInit: PostVoteInit = {
      type: postVoteDTOTypeToDBType(data.type),
      postId: data.postId,
      ownerId,
    };
    
    const vote = await this.postVoteRepository.persist(modelInit);

    return PostVoteResponseDTO.from(vote);
  }

  async delete(id: number): Promise<void> {
    await this.postVoteRepository.delete(id);
  }

  async list(options?: ListPostVoteOptions): Promise<PostVoteResponseDTO[]> {
    const votes = await this.postVoteRepository.list(options);

    return votes.map(vote => PostVoteResponseDTO.from(vote));
  }
}
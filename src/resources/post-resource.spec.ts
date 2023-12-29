import { Post } from '@prisma/client';
import { describe, expect, test } from 'vitest';
import { PostResponseDTO } from '../dtos/response/post';
import { IPostRepository, ListPostOptions, PostInit } from '../repositories/post-repository';
import { PostService } from '../services/post-service';
import { ResponseMock } from '../testing/response.mock';
import { IResponse } from './base/response';
import { PostResource } from './post-resource';
import { WebApplicationError } from '../errors/web-error';

class PostRepositoryMock implements IPostRepository {
  data: Post[] = [];
  idCount = 1;

  async findById(id: number): Promise<Post | null> {
    return this.data.find(post => post.id === id) ?? null;
  }

  async list(options?: ListPostOptions): Promise<Post[]> {
    return Array.from(this.data);
  }

  async persist(post: PostInit): Promise<Post> {
    const createdPost: Post = {
      authorId: post.authorId ?? 0,
      content: post.content,
      id: this.idCount++,
      title: post.title,
    };

    this.data.push(createdPost);

    return createdPost;
  }

  async delete(id: number): Promise<Post> {
    const idx = this.data.findIndex(post => post.id === id);
    const [post] = this.data.splice(idx, 1);

    return post;
  }
}

function mockPostResource() {
  const repository = new PostRepositoryMock();
  const service = new PostService({ postRepository: repository });
  const resource = new PostResource({ postService: service });

  return { repository, service, resource };
}

function handleError(resp: IResponse) {
  return (err: unknown) => {
    if (err instanceof WebApplicationError) {
      resp.status(err.status).send(err.message);

      return;
    }

    resp.status(500);
  }
}

describe(PostResource, () => {
  describe(PostResource.prototype.get, () => {
    test(`Shold response 404 status code if post don't exists`, async () => {
      const { resource } = mockPostResource();
      const resp = ResponseMock.create<PostResponseDTO>();

      await resource.get(1, resp)
        .catch(handleError(resp));

      expect(resp.getStatus())
        .toBe(404);
    });

    test(`Shold response with 200 status code and the post if post exists`, async () => {
      const { repository, resource } = mockPostResource();
      const resp = ResponseMock.create<PostResponseDTO>();

      const post = await repository.persist({ content: 'N/A', title: 'post test', authorId: 1 });

      await resource.get(post.id, resp)
        .catch(handleError(resp));

      expect(resp.getStatus())
        .toBe(200);

      const postResponse = resp.getBody();
      if (typeof postResponse === 'object') {
        expect(postResponse.authorId)
          .toBe(post.id);
          
      } else {
        expect.fail('Incorrect response media type');
      }
    });
  });
});
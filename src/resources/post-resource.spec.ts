import { describe, test } from 'vitest';
import { PostInit } from '../repositories/post-repository';
import { PostService } from '../services/post-service';
import { PostRepositoryMock } from '../testing/post-repository.mock';
import { PostResource } from './post-resource';
import { ResponseAsserter } from '../testing/response-asserter';
import { Tester } from '../testing/tester';
import { JWTInfo } from '../auth/request-jwt';
import { randomInt } from 'crypto';

function mockPostResource() {
  const repository = new PostRepositoryMock();
  const service = new PostService({ postRepository: repository });
  const resource = new PostResource({ postService: service });

  return { repository, service, resource };
}

describe(PostResource, () => {
  describe(PostResource.prototype.get, () => {
    test(`Shold response 404 status code if post don't exists`, async () => {
      const { resource } = mockPostResource();

      await ResponseAsserter
        .from(resp => resource.get(1, resp))
        .expectStatus(404)
        .result();
    });

    test(`Shold response with 200 status code and the post if post exists`, async () => {
      const { repository, resource } = mockPostResource();

      const post = await repository.persist({ content: 'N/A', title: 'post test', authorId: 1 });

      await ResponseAsserter
        .from(resp => resource.get(post.id, resp))
        .expectStatus(200)
        .expectBody([], Tester.exists())
        .result();
    });
  });

  describe(PostResource.prototype.list, () => {
    test(`Shold filter posts by authorId query param`, async () => {
      const { resource, repository } = mockPostResource();

      const postInits: PostInit[] = [
        { content: 'post text...', title: 'post of author 1', authorId: 1 },
        { content: 'post text...', title: 'post of author 2', authorId: 2 },
        { content: 'post text...', title: 'post of author 2', authorId: 2 },
        { content: 'post text...', title: 'post of author 3', authorId: 3 },
        { content: 'post text...', title: 'post of author 3', authorId: 3 },
        { content: 'post text...', title: 'post of author 3', authorId: 3 },
        { content: 'post text...', title: 'post of author 3', authorId: 3 },
        { content: 'post text...', title: 'post of author 3', authorId: 3 },
      ];

      postInits.forEach(postInit => {
        repository.persist(postInit);
      });

      const searchAuthorId = 1;

      await ResponseAsserter
        .from(resp => resource.list({ authorId: searchAuthorId }, resp))
        .expectStatus(200)
        .expectBody([0, 'authorId'], Tester.equals(searchAuthorId))
        .expectBody('length', Tester.equals(1))
        .result();
    });
  });

  describe(PostResource.prototype.delete, async () => {
    test(`Shold delete the post if auth.roles includes admin`, async () => {
      const { resource, repository } = mockPostResource();

      const post = await repository.persist({ content: 'post text...', title: 'post 1', authorId: 1 });

      const jwt = new JWTInfo({
        [JWTInfo.JWT_PAYLOAD]: {
          id: 2,
          name: '',
          roles: ['admin'],
        }
      });

      await ResponseAsserter
        .from(resp => resource.delete(post.id, jwt, resp))
        .expectStatus(200)
        .result();

      await ResponseAsserter
        .from(resp => resource.get(post.id, resp))
        .expectStatus(404)
        .result();
    });

    test(`Shold delete the post if auth.id matches with authorId`, async () => {
      const { resource, repository } = mockPostResource();

      const authorId = randomInt(255);
      const post = await repository.persist({ content: 'post text...', title: 'post 1', authorId });

      const jwt = JWTInfo.fromPayload({
        id: authorId,
        name: '',
        roles: ['user'],
      });

      await ResponseAsserter
        .from(resp => resource.delete(post.id, jwt, resp))
        .expectStatus(200)
        .result();

      await ResponseAsserter
        .from(resp => resource.get(post.id, resp))
        .expectStatus(404)
        .result();
    });

    test(`Sholdn't delete the post and response with 401 status code if auth.id don't matches with authorId`, async () => {
      const { resource, repository } = mockPostResource();

      const post = await repository.persist({ content: 'post text...', title: 'post 1', authorId: 1 });

      const jwt = JWTInfo.fromPayload({
        id: 2,
        name: '',
        roles: ['user'],
      });

      await ResponseAsserter
        .from(resp => resource.delete(post.id, jwt, resp))
        .expectStatus(401)
        .result();

      await ResponseAsserter
        .from(resp => resource.get(post.id, resp))
        .expectStatus(200)
        .result();
    });
  });
});
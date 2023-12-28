import { AuthResource } from "./auth-resource";
import { HandlerBuilderClass, resource } from "./base/factory";
import { PostResource } from "./post-resource";
import { UserResource } from "./user-resource";

const builders: HandlerBuilderClass[] = [
  AuthResource,
  UserResource,
  PostResource,
];

export const resources = builders.map(Builder => resource.from(Builder));
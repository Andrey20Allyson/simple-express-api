import e from "express";
import { authResource } from "./auth-resource";
import { userResource } from "./user-resource";

export const resources: e.RequestHandler[] = [
  authResource,
  userResource,
];
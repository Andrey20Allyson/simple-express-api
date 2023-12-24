import { WebApplicationError } from "./web-error";

export class UnauthorizedError extends WebApplicationError {
  constructor(message?: string) {
    super(401, message);
  }
}
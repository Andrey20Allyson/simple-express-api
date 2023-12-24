import { WebApplicationError } from "./web-error";

export class NotFoundError extends WebApplicationError {
  constructor(message?: string) {
    super(404, message);
  }
}
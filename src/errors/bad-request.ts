import { WebApplicationError } from "./web-error"

export class BadRequestError extends WebApplicationError {
  constructor(message?: string) {
    super(400, message);
  }
}
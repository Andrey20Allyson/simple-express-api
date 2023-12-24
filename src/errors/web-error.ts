export class WebApplicationError extends Error {
  constructor(
    readonly status: number,
    message?: string,
  ) {
    super(message);
  }
} 
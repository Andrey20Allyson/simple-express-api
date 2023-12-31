import { WebApplicationError } from "../errors/web-error";
import { IResponse } from "../resources/base/response";

export function handleError(resp: IResponse) {
  return (err: unknown) => {
    if (err instanceof WebApplicationError) {
      resp.status(err.status).json({ type: 'error', error: err.message });

      return;
    }

    resp.status(500);
  }
}
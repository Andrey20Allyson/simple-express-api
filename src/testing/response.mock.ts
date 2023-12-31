import { expect } from "vitest";
import { IResponse } from "../resources/base/response";

export interface ResponseData<T> {
  body: T | null;
  status: number;
}

export class ResponseMock<T extends object> implements IResponse<T> {
  private constructor(private data: ResponseData<T> = { body: null, status: -1 }) { }

  status(code: number): IResponse<T> {
    this.data.status = code;

    return this;
  }

  private setBody(body: T): this {
    if (this.data.status === -1) this.data.status = 200;
    this.data.body = body;

    return this;
  }

  json(data: T): IResponse<T> {
    return this.setBody(data);
  }

  end(): IResponse<T> {
    return this;
  }

  getBody() {
    return this.data.body ?? expect.fail(`Tried to get body data but is null`);
  }

  getStatus() {
    return this.data.status;
  }

  static create<T extends Object>() {
    return new this<T>();
  }
}
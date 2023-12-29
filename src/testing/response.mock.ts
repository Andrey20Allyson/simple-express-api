import { IResponse } from "../resources/base/response";

export interface ResponseData<T> {
  body: T | string | null;
  status: number;
}

export enum MediaType {
  APPLICATION_JSON = 'application/json',
  TEXT_PLAIN = 'text/plain',
}

export class ResponseMock<T extends object> implements IResponse<T> {
  private constructor(private data: ResponseData<T> = { body: null, status: -1 }) { }

  status(code: number): IResponse<T> {
    this.data.status = code;

    return this;
  }

  private setBody(body: T | string): this {
    if (this.data.status === -1) this.data.status = 200;
    this.data.body = body;

    return this;
  }

  send(text: string): IResponse<T> {
    return this.setBody(text);
  }

  json(data: T): IResponse<T> {
    return this.setBody(data);
  }

  end(): IResponse<T> {
    return this;
  }

  getContentType(): MediaType {
    switch (typeof this.getBody()) {
      case 'string':
        return MediaType.TEXT_PLAIN;
      case 'object':
        return MediaType.APPLICATION_JSON;
    }
  }

  getBody() {
    return this.data.body ?? '';
  }

  getStatus() {
    return this.data.status;
  }

  static create<T extends Object>() {
    return new this<T>();
  }
}
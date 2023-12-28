export interface IResponse<Body = any> {
  status(code: number): IResponse<Body>;
  send(text: string): IResponse<Body>;
  json(data: Body): IResponse<Body>;
  end(): IResponse<Body>;
}
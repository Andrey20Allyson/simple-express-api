export interface IResponse<Body = any> {
  status(code: number): IResponse<Body>;
  json(data: Body): IResponse<Body>;
  end(): IResponse<Body>;
}
export class AuthResponseDTO {
  readonly type = 'auth-token:jwt';

  constructor(
    readonly data: string,
  ) { }
}
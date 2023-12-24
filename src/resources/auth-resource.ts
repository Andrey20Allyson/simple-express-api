import { SignInRequestDTO } from "../dtos/sign-in-request-dto";
import { SignUpRequestDTO } from "../dtos/sign-up-request-dto";
import { AuthService } from "../services/auth-service";
import { valid } from "../validation/middlewares";
import { resource } from "./factory";

export const authResource = resource((router, config) => {
  const service = new AuthService();

  config.path = '/auth';

  router.post('/sign-in',
    valid(SignInRequestDTO),
    (req, res) => {
      const token = service.signIn(req.body);

      res.send(token);
    }
  );

  router.post('/sign-up',
    valid(SignUpRequestDTO),
    (req, res) => {
      const token = service.signUp(req.body);

      res
        .status(201)
        .send(token);
    }
  );
});

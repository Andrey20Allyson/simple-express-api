import { authorized } from "../auth/middlewares";
import { JWTInfo } from "../auth/request-jwt";
import { SignInRequestDTO } from "../dtos/sign-in-request-dto";
import { SignUpRequestDTO } from "../dtos/sign-up-request-dto";
import { AuthService } from "../services/auth-service";
import { UserService } from "../services/user-service";
import { valid } from "../validation/middlewares";
import { resource } from "./factory";

export const authResource = resource((router, config) => {
  const authService = new AuthService();
  const userService = new UserService();

  config.path = '/auth';

  router.get('/',
    authorized(),
    (req, res) => {
      const jwt = new JWTInfo(req);

      const { id } = jwt.payload();
      const user = userService.get(id);

      return res.json(user);
    }
  );

  router.post('/sign-in',
    valid(SignInRequestDTO),
    (req, res) => {
      const token = authService.signIn(req.body);

      res.send(token);
    }
  );

  router.post('/sign-up',
    valid(SignUpRequestDTO),
    (req, res) => {
      const token = authService.signUp(req.body);

      res
        .status(201)
        .send(token);
    }
  );
});

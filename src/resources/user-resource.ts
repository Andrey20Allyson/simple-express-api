import { authorized } from "../auth/middlewares";
import { UserService } from "../services/user-service";
import { resource } from "./factory";

export const userResource = resource((router, config) => {
  const service = new UserService();

  config.path = '/users';

  router.get('/', (_, res) => {
    const users = service.getAll();

    res.json(users);
  });

  router.get('/:id',
    authorized({ roles: ['user'] }),
    (req, res) => {
      const id = Number(req.params.id);
      const user = service.get(id);

      res.json(user);
    }
  );
});
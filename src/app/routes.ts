import { Application } from 'express';
import MulterConfig from '../config/multer';

import UserController from './users/users.controller';

const userController = new UserController();

export default function Routes(server: Application) {
  server.get('/ping', (_req, res) => {
    return res.sendStatus(204);
  });

  server.post('/users', userController.create);
  server.get('/users', userController.getByEmail);
  server.put('/users/:id', userController.update);
  server.delete('/users/:id', userController.delete);

  server.put('/users/:id/profile', MulterConfig('local'), userController.updateProfile);
}

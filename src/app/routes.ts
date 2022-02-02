import { Application } from 'express';
import MulterConfig from '../config/multer';

import UserController from './users/users.controller';
import UsersRepository from './users/users.repository';

const userController = new UserController(new UsersRepository());

export default function Routes(server: Application) {
  server.get('/ping', (_req, res) => {
    return res.sendStatus(204);
  });

  server.post('/upload', MulterConfig('s3'), (req, res) => {
    const file = req.file as unknown as { originalname: string; location: string };

    return res.json({
      file: {
        name: file?.originalname,
        url: file?.location,
      },
    });
  });

  server.post('/users', userController.create);
  server.get('/users', userController.getByEmail);
  server.put('/users/:id', userController.update);
  server.delete('/users/:id', userController.delete);
}

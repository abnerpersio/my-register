import { Request, Response } from 'express';

import { users as UserModel } from '@prisma/client';
import UsersRepository from './users.repository';

import Validate from '../../shared/validators/schema';
import { RequestError } from '../../shared/errors/request-error';
import { messages } from '../../shared/constants/messages';

export default class UserController {
  constructor(public usersRepository: UsersRepository) {}

  getByEmail = async (
    req: Request<unknown, unknown, unknown, { email: string }>,
    res: Response,
  ) => {
    const { email } = req.query;

    const user = await this.usersRepository.findByEmail({ email });

    if (!user) {
      throw new RequestError(messages.USER_NOT_FOUND, 404);
    }

    return res.json({
      success: true,
      data: user,
    });
  };

  create = async (req: Request<unknown, unknown, UserModel>, res: Response) => {
    Validate(req.body, {
      name: 'string',
      email: 'string',
      password: 'string',
      gender: 'string',
    });

    const userAlreadyExists = await this.usersRepository.findByEmail({ email: req.body.email });

    if (userAlreadyExists) {
      throw new RequestError('User already exists', 400);
    }

    const user = await this.usersRepository.create(req.body);

    return res.json({
      success: true,
      data: user,
    });
  };

  update = async (req: Request<{ id: string }, unknown, UserModel>, res: Response) => {
    const { id } = req.params;

    const updatedUser = await this.usersRepository.update({
      id,
      data: req.body,
    });

    return res.json({
      success: true,
      data: updatedUser,
    });
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    await this.usersRepository.delete(id);

    return res.sendStatus(204);
  };
}

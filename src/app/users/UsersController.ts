import { Request, Response } from 'express';

import UsersRepository from './UsersRepository';

import Validate from '../../shared/validators/schema';
import { RequestError } from '../../shared/errors/request-error';
import { messages } from '../../shared/constants/messages';
import { IUser } from 'src/shared/interfaces/users';

export default class UserController {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

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

  create = async (req: Request<unknown, unknown, IUser>, res: Response) => {
    const { body } = req;

    Validate(body, {
      name: 'string',
      email: 'string',
      password: 'string',
      gender: 'string',
    });

    const userAlreadyExists = await this.usersRepository.findByEmail({ email: body.email });

    if (userAlreadyExists) {
      throw new RequestError('User already exists', 400);
    }

    const user = await this.usersRepository.create(body);

    return res.json({
      success: true,
      data: user,
    });
  };

  update = async (req: Request<{ id: string }, unknown, IUser>, res: Response) => {
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

  updateProfile = async (req: Request<{ id: string }>, res: Response) => {
    const path = (req.file as Express.Multer.File)?.path;
    const location = (req.file as Express.MulterS3.File)?.location;

    if (!path && !location) {
      throw new RequestError('Invalid file uploaded', 422);
    }

    const updatedUser = await this.usersRepository.updateProfile({
      id: Number(req.params.id),
      filePath: path || location,
    });

    res.json({
      success: true,
      data: updatedUser,
    });
  };
}

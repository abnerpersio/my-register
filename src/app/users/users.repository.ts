import { users as UserModel } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { IGetUser, ICreateUser, IUpdateUser } from '../../shared/interfaces/users.interfaces';

export default class UsersRepository {
  private readonly users;

  constructor() {
    this.users = prisma.users;
  }

  DEFAULT_SELECT = {
    id: true,
    name: true,
    email: true,
    gender: true,
  };

  findByEmail({ email, getPassword = false }: IGetUser): Promise<Partial<UserModel> | null> {
    return this.users.findUnique({
      where: {
        email,
      },
      select: {
        ...this.DEFAULT_SELECT,
        password: getPassword,
      },
    });
  }

  create(user: ICreateUser): Promise<Partial<UserModel>> {
    return this.users.create({
      data: user,
      select: this.DEFAULT_SELECT,
    });
  }

  update({ id, data }: { id: string; data: IUpdateUser }): Promise<Partial<UserModel>> {
    return this.users.update({
      where: {
        id: parseInt(id),
      },
      data: {
        email: data.email,
        name: data.email,
        gender: data.gender,
      },
      select: this.DEFAULT_SELECT,
    });
  }

  async delete(id: string) {
    await this.users.delete({
      where: {
        id: parseInt(id),
      },
    });
  }
}

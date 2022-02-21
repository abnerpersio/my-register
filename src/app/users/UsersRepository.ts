import { prisma } from '../../config/prisma';
import { IGetUser, ICreateUser, IUpdateUser, IUser } from '../../shared/interfaces/users';

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
    images: true,
  };

  findByEmail({ email, getPassword = false }: IGetUser): Promise<Partial<IUser> | null> {
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

  create(user: ICreateUser): Promise<Partial<IUser>> {
    return this.users.create({
      data: user,
      select: this.DEFAULT_SELECT,
    });
  }

  update({ id, data }: { id: string; data: IUpdateUser }): Promise<Partial<IUser>> {
    return this.users.update({
      where: {
        id: parseInt(id),
      },
      data: {
        email: data.email,
        name: data.name,
        gender: data.gender,
      },
      select: this.DEFAULT_SELECT,
    });
  }

  updateProfile({ id, filePath }: { id: number; filePath: string }): Promise<Partial<IUser>> {
    return this.users.update({
      where: {
        id,
      },
      include: {
        images: true,
      },
      data: {
        images: {
          create: {
            url: filePath,
          },
        },
      },
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

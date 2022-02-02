import { ICreateUser } from 'src/shared/interfaces/users.interfaces';
import { prisma } from '../../src/config/prisma';

export default class UserGenerator {
  static async deleteAll() {
    return prisma.users.deleteMany();
  }

  static async create(user: ICreateUser) {
    return prisma.users.create({
      data: user,
    });
  }
}

import { users as UserModel } from '@prisma/client';

export interface IGetUser {
  email: string;
  getPassword?: boolean;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  gender: string;
}

export interface IUpdateUser extends ICreateUser {}

export interface IUser extends UserModel {}

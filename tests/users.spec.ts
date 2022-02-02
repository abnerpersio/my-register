import * as request from 'supertest';

import server from '../src/server';
import { prisma } from '../src/config/prisma';

import UserGenerator from './utils/user-generator';

describe('Users Controller', () => {
  const defaultMockUser = {
    email: 'test@test.com',
    name: 'test',
    gender: 'male',
    password: 'pass',
  };

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterEach(async () => {
    await UserGenerator.deleteAll();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /users validations', () => {
    test('should validate missing field', async () => {
      const response = await request(server).post('/users').send({
        email: 'test@test.com',
        gender: 'male',
        password: 'sazdasdasd',
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe("Invalid payload. Missing field: 'name'");
    });

    test('should validate invalid field', async () => {
      const response = await request(server).post('/users').send({
        email: 'test@test.com',
        gender: 'male',
        name: 12121212,
        password: 'sazdasdasd',
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe("Invalid payload. Field 'name' with type: 'number'");
    });
  });

  test('should create user', async () => {
    const response = await request(server).post('/users').send(defaultMockUser);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('test@test.com');
    expect(response.body.data.name).toBe('test');
  });

  test('should get an user', async () => {
    await UserGenerator.create(defaultMockUser);

    const response = await request(server).get('/users').query({
      email: 'test@test.com',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('test@test.com');
    expect(response.body.data.name).toBe('test');
  });

  test('should update an user', async () => {
    const user = await UserGenerator.create(defaultMockUser);

    const response = await request(server).put(`/users/${user.id}`).send({
      email: 'test-updated@test.com',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('test-updated@test.com');
  });

  test('should delete an user', async () => {
    const user = await UserGenerator.create(defaultMockUser);

    const response = await request(server).delete(`/users/${user.id}`);

    expect(response.status).toBe(204);
  });
});

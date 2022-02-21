import * as request from 'supertest';
import * as path from 'path';
import * as fs from 'fs';

process.env.UPLOAD_TYPE = 'local';

import server from '../src/server';
import { prisma } from '../src/config/prisma';

import { UserGenerator } from './utils/UserGenerator';

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

    await fs.promises.rm(path.resolve(__dirname, '..', 'tmp', 'uploads'), {
      recursive: true,
      force: true,
    });

    await fs.promises.mkdir(path.resolve(__dirname, '..', 'tmp', 'uploads'));
  });

  describe('GET /users validations', () => {
    test('should return user not found', async () => {
      const response = await request(server).get('/users').query({
        email: 'not-found@test.com',
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User was not found');
    });
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

    test('should validate creation when user already exists', async () => {
      const user = await UserGenerator.create(defaultMockUser);

      const response = await request(server).post('/users').send({
        email: user.email,
        gender: 'female',
        name: 'fulano silva',
        password: 'test-password',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('PUT /users/:id/profile validations', () => {
    test('should validate invalid profile image sent', async () => {
      const user = await UserGenerator.create(defaultMockUser);

      const response = await request(server).put(`/users/${user.id}/profile`);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Invalid file uploaded');
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

  test('should upload profile image', async () => {
    const user = await UserGenerator.create(defaultMockUser);

    const response = await request(server)
      .put(`/users/${user.id}/profile`)
      .attach('file', path.resolve(__dirname, 'mocks', 'mock-image.png'));

    expect(response.status).toBe(200);
    expect(response.body.data.image_id).not.toBeNull();
  });
});

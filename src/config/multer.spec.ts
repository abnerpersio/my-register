import * as request from 'supertest';
import * as path from 'path';

process.env.UPLOAD_TYPE = 'aws';

import MulterConfig from './multer';
import server from '../server';
import { prisma } from './prisma';
import { UserGenerator } from '../../tests/utils/UserGenerator';

jest.mock('aws-sdk', () => ({
  config: {
    update: jest.fn(),
    credentials: {},
  },
  Credentials: jest.fn(),
  S3: jest.fn().mockImplementation(() => ({
    upload: jest.fn().mockImplementation(() => ({
      on: jest.fn().mockReturnThis(),
      send: jest.fn().mockImplementation((cb: Function) => {
        cb(null, {
          Location: 'http://dsad13-test-location-image.png',
          ETag: 'fasdsad',
          versionId: 2,
        });
      }),
    })),
  })),
}));

describe(MulterConfig.name, () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterEach(async () => {
    await UserGenerator.deleteAll();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should upload a image to s3', async () => {
    const user = await UserGenerator.create({
      email: 'test@test.com',
      name: 'test',
      gender: 'male',
      password: 'pass',
    });

    const response = await request(server)
      .put(`/users/${user.id}/profile`)
      .attach('file', path.resolve(__dirname, '..', '..', 'tests', 'mocks', 'mock-image.png'));

    expect(response.status).toBe(200);
    expect(response.body.data.image_id).not.toBeNull();
    expect(response.body.data.images.url).toBe('http://dsad13-test-location-image.png');
  });

  it('should get an error when not setted multer upload type config env', () => {
    process.env = {};

    expect(MulterConfig).toThrow('Invalid upload type configured');
  });
});

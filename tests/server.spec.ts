import * as request from 'supertest';

import server from '../src/server';

describe('Server', () => {
  test('GET /ping', async () => {
    const response = await request(server).get('/ping');
    expect(response.status).toBe(204);
  });
});

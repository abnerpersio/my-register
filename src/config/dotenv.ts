import { config } from 'dotenv';

const isTestEnvironment = process.env.NODE_ENV === 'test';

config({
  path: isTestEnvironment ? '.env.test' : '.env',
});

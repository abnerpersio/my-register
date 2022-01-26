import './dotenv';
import * as aws from 'aws-sdk';

aws.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

aws.config.credentials = new aws.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_ACCESS_TOKEN || '',
});

export default aws;

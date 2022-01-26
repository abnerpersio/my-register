import * as crypto from 'crypto';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as path from 'path';

import aws from './aws';

const config: { [key: string]: multer.Options } = {
  s3: {
    storage: multerS3({
      s3: new aws.S3(),
      bucket: process.env.BUCKET_NAME || 'upload-testes',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (_req, file, cb) => {
        crypto.randomBytes(6, (err, hash) => {
          if (err) cb(err);

          const fileName = `${hash.toString('hex')}-${file.originalname}`;

          cb(null, fileName);
        });
      },
    }),
  },
  local: {
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
      },
      filename: (_req, file, cb) => {
        crypto.randomBytes(6, (err, hash) => {
          if (err) cb(null, file.originalname);

          const fileKey = `${hash.toString('hex')}-${file.originalname}`;

          cb(null, fileKey);
        });
      },
    }),
  },
};

export default function MulterConfig(type: 's3' | 'local') {
  return multer(config[type]).single('file');
}

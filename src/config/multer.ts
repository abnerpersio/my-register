import * as crypto from 'crypto';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as path from 'path';

import aws from './aws';

const DEFAULT_BUCKET = 'upload-testes';

function formatFileName(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, fileName: string) => void,
) {
  const buffer = crypto.randomBytes(6);
  cb(null, `${buffer.toString('hex')}-${file.originalname}`);
}

const config: { [key: string]: multer.Options } = {
  aws: {
    storage: multerS3({
      s3: new aws.S3(),
      bucket: process.env.BUCKET_NAME || DEFAULT_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: formatFileName,
    }),
  },
  local: {
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
      },
      filename: formatFileName,
    }),
  },
};

export default function MulterConfig() {
  const { UPLOAD_TYPE } = process.env;

  if (!UPLOAD_TYPE) throw new Error('Invalid upload type configured');

  return multer(config[UPLOAD_TYPE as string]).single('file');
}

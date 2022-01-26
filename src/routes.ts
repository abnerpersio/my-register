import { Application } from 'express';
import MulterConfig from './config/multer';

export default function Routes(server: Application) {
  server.get('/ping', (_req, res) => {
    return res.sendStatus(204);
  });

  server.post('/upload', MulterConfig('s3'), (req, res) => {
    const file = req.file as unknown as { originalname: string; location: string };

    return res.json({
      file: {
        name: file?.originalname,
        url: file?.location,
      },
    });
  });
}

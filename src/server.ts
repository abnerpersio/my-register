import * as express from 'express';
import routes from './app/routes';
import 'express-async-errors';
import ErrorHandler from './shared/middlewares/error-handler';

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

routes(server);

server.use(ErrorHandler);

export default server;

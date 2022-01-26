import * as express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server running at ${PORT}`));

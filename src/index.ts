import server from './server';
import './config/dotenv';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running at ${PORT}`));

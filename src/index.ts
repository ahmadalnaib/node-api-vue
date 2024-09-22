import expres from 'express';
import cors from 'cors';
import { routes } from './routes';
import { createConnection } from 'typeorm';

// postgresql://postgres:2233@localhost:5432/node_api

createConnection().then(connection => {

const app = expres();

app.use(expres.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));



routes(app);



app.listen(8001, () => {
  console.log('Server running on port 8000');
});
});
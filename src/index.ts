import expres from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = expres();

app.use(expres.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));



routes(app);



app.listen(8001, () => {
  console.log('Server running on port 8000');
});
import expres from 'express';
import cors from 'cors';

const app = expres();

app.use(expres.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(8001, () => {
  console.log('Server running on port 8000');
});
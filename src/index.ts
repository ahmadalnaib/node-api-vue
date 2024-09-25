require('dotenv').config();

import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';

// postgresql://postgres:2233@localhost:5432/node_api

createConnection().then(connection => {

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));



routes(app);



app.listen(8001, () => {
  console.log('Server running on port 8000');
});
});
import express, { Express } from 'express';
import todoRoutes from './routes';
import cors from 'cors';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(todoRoutes);

app.get('/', (req, res) => {
  res.send('This is your reminder');
});

export default app;

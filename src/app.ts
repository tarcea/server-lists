import express, { Express } from 'express';
import todoRoutes from './routes';
import cors from 'cors';
import { login, signup } from './controllers/auth';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(todoRoutes);

app.post('/users/signup', signup);
app.post('/users/login', login);

app.get('/', (req, res) => {
  res.send('This is your reminder')
});

export default app;
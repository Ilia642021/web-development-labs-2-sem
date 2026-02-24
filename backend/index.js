import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimiter from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import sequelize from './config/db.js';
import usersRouter from './routes/users.js';
import eventsRouter from './routes/events.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use('/users', usersRouter);
app.use('/events', eventsRouter);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API работает!',
    time: new Date().toISOString() 
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => console.log('Таблицы синхронизированы (User и Event)'))
  .catch(err => console.error('Ошибка синхронизации моделей:', err));

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

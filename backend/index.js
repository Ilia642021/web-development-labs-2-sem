import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';

import User from './models/User.js';
import Event from './models/Event.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Events API!',
    status: 'ok',
    time: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => console.log('Таблицы синхронизированы (User и Event)'))
  .catch(err => console.error('Ошибка синхронизации моделей:', err));

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

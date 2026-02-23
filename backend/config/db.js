import { Sequelize } from 'sequelize';
import 'dotenv/config';   // ← тоже здесь, чтобы работало независимо

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('→ Подключение к PostgreSQL успешно'))
  .catch(err => console.error('→ Ошибка подключения к базе:', err.message));

export default sequelize;

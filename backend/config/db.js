const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,               // отключить логи SQL-запросов (можно включить true для отладки)
    dialectOptions: {
      ssl: false                  // если в будущем будешь использовать облако — можно включить
    }
  }
);

// Проверка соединения при запуске (для отладки)
sequelize.authenticate()
  .then(() => {
    console.log('→ Подключение к PostgreSQL успешно');
  })
  .catch(err => {
    console.error('→ Ошибка подключения к базе:', err.message);
  });

module.exports = sequelize;

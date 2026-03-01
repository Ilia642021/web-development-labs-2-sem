import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import sequelize from './config/db.js';
import rateLimiter from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import usersRouter from './routes/users.js';
import eventsRouter from './routes/events.js';
import setupAssociations from './models/associations.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();

// Базовые middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Маршруты API
app.use('/users', usersRouter);
app.use('/events', eventsRouter);

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'API работает!',
    time: new Date().toISOString()
  });
});

// === Swagger конфигурация ===
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Управления Мероприятиями',
      version: '1.0.0',
      description: 'REST API для лабораторной работы №1 (вариант 19)',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            createdBy: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // должно быть относительно backend/
};

const specs = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { background-color: #1e1e1e; }
    .swagger-ui .info { color: #fff; }
  `,
  customSiteTitle: 'Лаб 1 - API Мероприятий',
  swaggerOptions: {
    docExpansion: 'list',
  },
}));

// Обработчик ошибок — ПОСЛЕ всех роутов и Swagger
app.use(errorHandler);

// Запуск сервера после синхронизации
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    setupAssociations();
    await sequelize.sync({ alter: true });
    console.log('Таблицы синхронизированы (User и Event)');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
      console.log(`Swagger доступен по адресу: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Ошибка запуска сервера:', err);
  }
})();

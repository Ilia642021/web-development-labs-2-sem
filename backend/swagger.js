import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API управления мероприятиями',
      version: '1.0.0',
      description: 'REST API для лабораторной работы №1 (вариант 19)',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {}, // если позже добавишь auth — здесь
    },
  },
  apis: ['./routes/*.js'], // пути к файлам с JSDoc-комментариями
};

const specs = swaggerJsdoc(options);

export default specs;

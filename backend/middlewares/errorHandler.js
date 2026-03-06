const errorHandler = (err, req, res, next) => {
  console.error('Ошибка:', err);

  // Обработка ошибок Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Ошибка валидации данных',
      details: err.errors.map(e => e.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Запись уже существует',
      detail: err.errors?.[0]?.message || 'Дубликат уникального поля',
    });
  }

  // Обработка ошибок от Passport / JWT
  if (err.name === 'UnauthorizedError' || err.message?.includes('jwt')) {
    return res.status(401).json({
      message: err.message || 'Не авторизован (токен недействителен или отсутствует)',
    });
  }

  // Обычные кастомные ошибки с statusCode
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  const response = {
    message,
  };

  // В development показываем больше информации
  if (process.env.NODE_ENV === 'development') {
    response.error = err.name;
    response.stack = err.stack;
    response.details = err.details || null;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
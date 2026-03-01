const errorHandler = (err, req, res, next) => {
  console.error('Ошибка:', err);

  // Обработка ошибок Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Ошибка валидации',
      details: err.errors.map(e => e.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Запись уже существует',
      detail: err.errors?.[0]?.message || 'Дубликат уникального поля',
    });
  }

  // Обычные ошибки с statusCode
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;

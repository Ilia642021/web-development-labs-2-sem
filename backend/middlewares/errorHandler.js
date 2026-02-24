const errorHandler = (err, req, res, next) => {
  console.log('=== ERROR HANDLER СРАБОТАЛ ===');
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  res.status(statusCode).json({
    error: message,
    // в продакшене можно убрать stack, но для разработки полезно
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;

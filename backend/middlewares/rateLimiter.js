import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,          // 1 минута
  max: 100,                     // лимит — 100 запросов за окно
  message: {
    error: 'Слишком много запросов. Попробуйте снова через минуту.'
  },
  standardHeaders: true,        // возвращает RateLimit-* заголовки
  legacyHeaders: false,
  // Можно добавить ключ по IP (по умолчанию используется req.ip)
  keyGenerator: (req) => req.ip,
});

export default limiter;

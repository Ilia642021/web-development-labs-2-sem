import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000,  // 60 секунд
  max: 100,         // максимум 100 запросов за минуту
  message: { error: 'Слишком много запросов. Попробуйте снова через минуту.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
  skip: () => false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode || 429).json(options.message);
  },
});

export default limiter;

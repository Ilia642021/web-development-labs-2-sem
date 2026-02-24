import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
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

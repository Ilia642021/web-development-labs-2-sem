import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// POST /users
router.post('/', async (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    const error = new Error('name и email обязательны');
    error.statusCode = 400;
    return next(error);
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('Пользователь с таким email уже существует');
    error.statusCode = 409;
    return next(error);
  }

  const user = await User.create({ name, email });
  res.status(201).json(user);
});

// GET /users
router.get('/', async (req, res, next) => {
  const users = await User.findAll();
const err = new Error('Тестовая ошибка');
err.statusCode = 418; // I'm a teapot 😄
throw err;
  res.json(users);
});

// GET /users/:id
router.get('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    const error = new Error('Пользователь не найден');
    error.statusCode = 404;
    return next(error);
  }

  res.json(user);
});

export default router;

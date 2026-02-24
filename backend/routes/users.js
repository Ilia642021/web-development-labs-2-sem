import express from 'express';
import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Операции с пользователями
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Пользователь создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Отсутствуют обязательные поля
 *       409:
 *         description: Email уже существует
 *       500:
 *         description: Ошибка сервера
 */

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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Ошибка сервера
 */
router.get('/', async (req, res, next) => {
  const users = await User.findAll();
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]+$'
 *           example: "1"
 *         description: ID пользователя
 *         example: 1
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
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

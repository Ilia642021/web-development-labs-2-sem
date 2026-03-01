import express from 'express';
import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Операции с пользователями
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
 *                 example: Алексей Иванов
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alex@example.com
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 name: { type: string }
 *                 email: { type: string }
 *                 createdAt: { type: string, format: date-time }
 *       400:
 *         description: Ошибка валидации (например, пустой email)
 *       409:
 *         description: Пользователь с таким email уже существует
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/', async (req, res, next) => {
  const user = await User.create(req.body);
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
 *                   id: { type: integer }
 *                   name: { type: string }
 *                   email: { type: string }
 *                   createdAt: { type: string, format: date-time }
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
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь найден
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return next({ statusCode: 404, message: 'Пользователь не найден' });
  res.json(user);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Обновить данные пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Новое имя пользователя
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Новый email
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлён
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
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Ошибка валидации (например, некорректный email)
 *       404:
 *         description: Пользователь не найден
 *       409:
 *         description: Email уже занят другим пользователем
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return next({ statusCode: 404, message: 'Пользователь не найден' });

  await user.update(req.body);
  res.json(user);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь успешно удалён (нет содержимого)
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return next({ statusCode: 404, message: 'Пользователь не найден' });

  await user.destroy();
  res.status(204).send();
});

export default router;

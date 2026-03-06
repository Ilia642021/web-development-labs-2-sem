import express from 'express';
import User from '../models/User.js';
import { authenticateJwt } from '../config/passport.js';   // ← добавляем это

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
 *     security:
 *       - bearerAuth: []               # ← добавляем замочек (требуется токен)
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
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 *       409:
 *         description: Пользователь с таким email уже существует
 *       500:
 *         description: Внутренняя ошибка
 */
router.post('/', authenticateJwt, async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []               # ← добавляем
 *     responses:
 *       200:
 *         description: Список пользователей
 *       401:
 *         description: Не авторизован
 */
router.get('/', authenticateJwt, async (req, res, next) => {
  const users = await User.findAll();
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []               # ← добавляем
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Пользователь найден
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:id', authenticateJwt, async (req, res, next) => {
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
 *     security:
 *       - bearerAuth: []               # ← добавляем
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлён
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 *       409:
 *         description: Email уже занят
 */
router.put('/:id', authenticateJwt, async (req, res, next) => {
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
 *     security:
 *       - bearerAuth: []               # ← добавляем
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Пользователь успешно удалён
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 */
router.delete('/:id', authenticateJwt, async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return next({ statusCode: 404, message: 'Пользователь не найден' });
  await user.destroy();
  res.status(204).send();
});

export default router;
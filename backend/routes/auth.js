import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Аутентификация и регистрация
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Некорректные данные или email уже занят
 *       500:
 *         description: Ошибка сервера
 */
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Необходимо указать name, email и password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });
    }

    // Проверка уникальности email (хотя в модели уже есть unique: true)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создаём пользователя — хеширование произойдёт в хуке beforeCreate
    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Успешный вход, возвращает JWT-токен
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Неверный email или пароль / аккаунт заблокирован
 *       500:
 *         description: Ошибка сервера
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Необходимо указать email и password' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверка блокировки
    if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
      return res.status(401).json({
        message: 'Аккаунт временно заблокирован. Попробуйте позже.',
        lockedUntil: user.lockUntil,
      });
    }

    // Сравнение пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Увеличиваем счётчик неудачных попыток
      user.failed_attempts += 1;

      if (user.failed_attempts >= 5) {
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 минут
        await user.save();

        return res.status(401).json({
          message: 'Слишком много неудачных попыток. Аккаунт заблокирован на 15 минут.',
          failedAttempts: user.failed_attempts,
          lockedUntil: user.lockUntil,
        });
      }

      await user.save();

      return res.status(401).json({
        message: 'Неверный email или пароль',
        failedAttempts: user.failed_attempts,
      });
    }

    // Успешный вход → сбрасываем счётчик
    user.failed_attempts = 0;
    user.isLocked = false;
    user.lockUntil = null;
    await user.save();

    // Генерируем JWT
    const payload = {
      id: user.id,
      email: user.email,
      // role: user.role, // если позже добавите роли
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', // или '15m' для короткоживущего access token
    });

    res.json({
      message: 'Успешный вход',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;


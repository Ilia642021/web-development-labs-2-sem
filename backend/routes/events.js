import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';

const router = express.Router();

// POST /events — создать мероприятие
router.post('/', async (req, res) => {
  try {
    const { title, description, date, createdBy } = req.body;

    if (!title || !date || !createdBy) {
      return res.status(400).json({ error: 'title, date и createdBy обязательны' });
    }

    // Проверяем, существует ли пользователь
    const user = await User.findByPk(createdBy);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь с таким createdBy не найден' });
    }

    const event = await Event.create({ title, description, date, createdBy });
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /events — список всех мероприятий
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /events/:id — одно мероприятие по ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /events/:id — обновить мероприятие
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    await event.update(req.body);
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /events/:id — удалить мероприятие
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    await event.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;

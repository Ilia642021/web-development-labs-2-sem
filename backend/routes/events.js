import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';

const router = express.Router();

// POST /events
router.post('/', async (req, res, next) => {
  const { title, description, date, createdBy } = req.body;

  if (!title || !date || !createdBy) {
    const error = new Error('title, date и createdBy обязательны');
    error.statusCode = 400;
    return next(error);
  }

  const user = await User.findByPk(createdBy);
  if (!user) {
    const error = new Error('Пользователь с таким createdBy не найден');
    error.statusCode = 404;
    return next(error);
  }

  const event = await Event.create({ title, description, date, createdBy });
  res.status(201).json(event);
});

// GET /events (с пагинацией)
router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { count, rows: events } = await Event.findAndCountAll({
    limit,
    offset,
    include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']],
  });

  res.json({
    data: events,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      hasNext: page * limit < count,
      hasPrev: page > 1,
    },
  });
});

// GET /events/:id
router.get('/:id', async (req, res, next) => {
  const event = await Event.findByPk(req.params.id, {
    include: [{ model: User, attributes: ['id', 'name', 'email'] }],
  });

  if (!event) {
    const error = new Error('Мероприятие не найдено');
    error.statusCode = 404;
    return next(error);
  }

  res.json(event);
});

// PUT /events/:id
router.put('/:id', async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    const error = new Error('Мероприятие не найдено');
    error.statusCode = 404;
    return next(error);
  }

  await event.update(req.body);
  res.json(event);
});

// DELETE /events/:id
router.delete('/:id', async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    const error = new Error('Мероприятие не найдено');
    error.statusCode = 404;
    return next(error);
  }

  await event.destroy();
  res.status(204).send();
});

export default router;

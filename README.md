# Web Development Labs (2 семестр)

**Студент:** Илья Яковенко  
**Группа:** ПрИ-31  
**Вариант:** 19 (пагинация + rate limiting)

## Лабораторная работа №1 — REST API для управления мероприятиями

**Цель:** Разработка серверной части приложения на Node.js + Express с использованием PostgreSQL и Sequelize ORM.

### Основные достижения

- Полноценный REST API с CRUD-операциями для пользователей и мероприятий
- Связь «один-ко-многим» (пользователь → много мероприятий через createdBy)
- Пагинация на GET /events (page и limit) — вариант 19
- Rate limiting (ограничение 100 запросов в минуту на IP) — вариант 19
- Централизованная обработка ошибок (отдельный middleware)
- Логирование запросов через morgan
- Интерактивная документация API через Swagger UI

### Технологии

- Node.js 24.x (ESM-модули)
- Express.js
- PostgreSQL 18.x + Sequelize ORM
- Зависимости: cors, dotenv, morgan, express-rate-limit, swagger-jsdoc, swagger-ui-express

### Структура проекта

```
web-development-labs/
├── backend/                  # серверная часть
│   ├── config/
│   │   └── db.js             # подключение к БД
│   ├── middlewares/
│   │   ├── errorHandler.js   # централизованный обработчик ошибок
│   │   └── rateLimiter.js    # rate limiting
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── routes/
│   │   ├── users.js
│   │   └── events.js
│   ├── swagger.js            # конфигурация Swagger
│   ├── index.js              # точка входа сервера
│   ├── package.json
│   └── .env                  # переменные окружения (не в git)
├── .gitignore
└── README.md
```

### Как запустить

1. Перейти в папку backend:
   ```bash
   cd backend
   ```

2. Установить зависимости (если ещё не):
   ```bash
   npm install
   ```

3. Создать/настроить .env (пример):
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=events_db
   DB_USER=student
   DB_PASSWORD=твой_пароль
   DB_DIALECT=postgres
   ```

4. Запустить сервер:
   ```bash
   npm run dev-clean   # убивает старые процессы и запускает nodemon
   ```

### Доступные эндпоинты

- **Документация API:** http://localhost:5000/api-docs (Swagger UI — интерактивная, можно тестировать запросы прямо в браузере)

- **Пользователи**
  - POST /users — создать пользователя
  - GET /users — список всех
  - GET /users/:id — один пользователь

- **Мероприятия**
  - POST /events — создать мероприятие (обязательно createdBy)
  - GET /events — список с пагинацией (?page=1&limit=10)
  - GET /events/:id — одно мероприятие
  - PUT /events/:id — обновить
  - DELETE /events/:id — удалить

### Вариант 19

- Пагинация на GET /events (page + limit)
- Rate limiting (100 запросов в минуту на IP)

### Дата начала / окончания лабораторной 1

- Начало: 24 февраля 2026
- Окончание: 24 февраля 2026 (основная часть завершена)

### Следующие лабораторные

- Лабораторная 2 — ... (пока пусто)

Готово к сдаче!

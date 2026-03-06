# Web Development Labs (2 семестр)

**Студент:** Яковенко Илья Юрьевич  
**Группа:** ПрИ-31  
**Вариант лабораторной №1:** 19 (пагинация + rate limiting)  
**Вариант лабораторной №2:** 19 (блокировка аккаунта после нескольких неудачных попыток входа)

## Общая структура проекта

```
web-development-labs/
├── backend/                        # серверная часть (вся лабораторная здесь)
│   ├── config/
│   │   ├── db.js                   # подключение к PostgreSQL через Sequelize
│   │   └── passport.js             # стратегия JWT + проверка блокировки
│   ├── middlewares/
│   │   ├── errorHandler.js         # централизованный обработчик ошибок
│   │   └── rateLimiter.js          # rate limiting (100 req/min)
│   ├── models/
│   │   ├── User.js                 # модель пользователя + хуки хеширования
│   │   ├── Event.js                # модель мероприятия
│   │   └── associations.js         # связи User.hasMany(Event)
│   ├── routes/
│   │   ├── auth.js                 # /auth/register, /auth/login
│   │   ├── users.js                # CRUD пользователей (защищён)
│   │   └── events.js               # CRUD мероприятий (GET / публичный)
│   ├── index.js                    # точка входа, middleware, роуты, swagger, sync
│   ├── package.json
│   ├── .env                        # не в git!
│   └── swagger.js                  # (если отдельно, иначе в index.js)
├── README.md
└── .gitignore
```

## Лабораторная работа №1 — REST API для управления мероприятиями

**Завершена:** февраль 2026  
**Вариант 19:** пагинация на GET /events + rate limiting

- Полный CRUD /users и /events
- Связь один-ко-многим (User → Events через createdBy)
- Пагинация (page, limit) без hasNext/hasPrev
- Rate limiting (100 запросов/минуту по IP)
- Swagger с тёмной темой
- Обработка ошибок Sequelize + централизованный errorHandler
- Логирование morgan 'dev'

## Лабораторная работа №2 — Аутентификация и авторизация с JWT

**Статус:** завершена  
**Вариант 19:** блокировка аккаунта после 5 неудачных попыток входа (brute-force protection)

- POST /auth/register — регистрация (name, email, password)
- POST /auth/login — вход → JWT-токен (expiresIn: 1h)
- Хранение паролей: bcryptjs, 12 раундов
- Защита маршрутов: passport-jwt (Bearer Token)
  - Публичный: только GET /events
  - Защищённые: все остальные (/users/*, POST/PUT/DELETE /events, GET /events/:id)
- Дополнительное задание (вариант 19):
  - Поля в User: failed_attempts, isLocked, lockUntil
  - После 5 неудач → блокировка на 15 минут
  - Сброс счётчика при успешном логине
  - Проверка блокировки в login и в JWT-стратегии
- Swagger: кнопка Authorize + Bearer-токен
- Улучшенный errorHandler (поддержка JWT-ошибок)

**Доступные эндпоинты**

**Аутентификация**  
- POST /auth/register  
- POST /auth/login  

**Пользователи** (все защищены)  
- POST /users  
- GET /users  
- GET /users/:id  
- PUT /users/:id  
- DELETE /users/:id  

**Мероприятия**  
- GET /events — публичный (пагинация ?page=1&limit=10)  
- POST /events — защищённый  
- GET /events/:id — защищённый  
- PUT /events/:id — защищённый  
- DELETE /events/:id — защищённый  

**Документация API**  
http://localhost:5000/api-docs (Swagger UI с поддержкой Bearer)

## Как запустить проект

1. Перейти в backend:
   ```bash
   cd backend
   ```

2. Установить зависимости (если ещё не):
   ```bash
   npm install
   ```

3. Настроить .env (пример):
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=events_db
   DB_USER=student
   DB_PASSWORD=My-postgres!PaSsworD&
   DB_DIALECT=postgres
   JWT_SECRET=твой_очень_длинный_секрет_здесь
   ```

4. Запустить сервер:
   ```bash
   sudo lsof -i :5000
   sudo kill -9 <PID>
   npm run dev
   ```

5. Зайти в базу (если нужно проверить данные):
   ```bash
   psql -U student -d events_db -h localhost
   ```

## Дата выполнения

- Лаба 1: февраль 2026
- Лаба 2: март 2026

Готово к сдаче лабораторной №2.


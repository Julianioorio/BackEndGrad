# BackEndGrad

Бэкенд-приложение для обработки форм и работы с базой данных.

## Описание

Это серверное приложение, написанное на Node.js с использованием Express.js. Оно обрабатывает POST-запросы с формами и карточками товара, сохраняет данные в базу данных.

## Технологии

- Node.js
- Express.js
- MySQL

## Установка

1. Клонируйте репозиторий:

```bash
git clone [URL репозитория]
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env` в корневой директории и добавьте необходимые переменные окружения:

```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

4. Создайте базу данных и выполните SQL-скрипты из директории `src/db/`:

```bash
psql -U your_db_user -d your_db_name -f src/db/init.sql
```

## Запуск

Для запуска в режиме разработки:

```bash
npm run dev
```

Для запуска в продакшн режиме:

```bash
npm start
```

## API Endpoints

### POST /submit

Обрабатывает отправку формы.

### GET /submissions

получение информации по данным в формах

GET /products

Получение данных из базы данных по карточкам товара

## Лицензия

MIT

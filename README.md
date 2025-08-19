# URL Shortener

Мини-сервис для создания коротких ссылок

## Архитектура

### Backend (NestJS + DDD/Clean Architecture)
- **TypeScript** - строгая типизация
- **NestJS** - масштабируемый Node.js фреймворк
- **DDD/Clean Architecture** - разделение на слои Domain, Application, Infrastructure
- **TypeORM + PostgreSQL** - ORM и база данных
- **Zod** - валидация переменных окружения
- **Swagger** - документация API
- **Jest** - unit и e2e тесты

### Frontend (React + FSD)
- **React + TypeScript** - UI библиотека с типизацией
- **Vite** - быстрый сборщик
- **Feature-Sliced Design (FSD)** - архитектура frontend
- **Tailwind CSS** - утилитарный CSS фреймворк
- **TanStack Query** - управление серверным состоянием
- **React Hook Form** - обработка форм
- **Vitest + RTL** - тестирование

### Инфраструктура
- **Docker** - контейнеризация
- **docker-compose** - оркестрация сервисов
- **nginx** - веб-сервер для frontend
- **PostgreSQL 16** - база данных

## Функционал

- Создание коротких ссылок из длинных URL
- Перенаправление по коротким ссылкам с подсчетом кликов
- Просмотр списка созданных ссылок с пагинацией
- Удаление ссылок
- Установка срока действия ссылок (опционально)
- Копирование ссылок в буфер обмена
-  Адаптивный дизайн

## API Endpoints

- `POST /links` - создать короткую ссылку
- `GET /r/:slug` - перенаправить по короткой ссылке (302)
- `GET /links?limit&offset` - получить список ссылок
- `DELETE /links/:id` - удалить ссылку
- `GET /api` - Swagger документация

## Быстрый старт

### Запуск с Docker Compose (рекомендуется)

```bash
# Клонируем репозиторий
git clone <repository-url>
cd links

# Запускаем все сервисы
docker-compose up -d

# Проверяем статус
docker-compose ps
```

Сервисы будут доступны:
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:3001/api
- **Database**: localhost:5432

### Разработка

```bash
# Установка зависимостей
npm install

# Запуск базы данных
docker-compose up -d db

# Настройка переменных окружения для API
cd apps/api
cp .env.example .env
# Отредактируйте .env файл

# Запуск API в режиме разработки
cd apps/api
npm run start:dev

# Запуск Frontend в режиме разработки (в отдельном терминале)
cd apps/web
npm run dev
```

### Тестирование

```bash
# Unit тесты API
cd apps/api
npm test

# E2E тесты API
npm run test:e2e

# Frontend тесты
cd apps/web
npm test

# Проверка типов во всем проекте
npm run typecheck

# Проверка кода
npm run lint
```

## Переменные окружения

### API (apps/api/.env)

```bash
NODE_ENV=development
PORT=3001
BASE_URL=http://localhost:3001

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/url_shortener
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=url_shortener
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# Для тестов
TEST_DATABASE_NAME=url_shortener_test
```

### Frontend (apps/web/.env)

```bash
VITE_API_BASE_URL=http://localhost:3001
```

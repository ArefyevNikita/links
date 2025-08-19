# Multi-stage build для API
FROM node:20-bookworm-slim AS deps

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Устанавливаем все зависимости с кэшированием
RUN npm ci --ignore-scripts --prefer-offline --no-audit

# Стадия сборки
FROM node:20-bookworm-slim AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости из предыдущей стадии
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/apps/api/package*.json ./apps/api/

# Копируем исходный код
COPY apps/api ./apps/api

# Собираем приложение
WORKDIR /app/apps/api
RUN npm run build

# Финальная стадия
FROM node:20-bookworm-slim AS runner

# Создаем пользователя для безопасности
RUN groupadd --gid 1001 nodejs \
  && useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nodejs

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем только runtime зависимости одной командой
RUN apt-get update \
  && apt-get install -y --no-install-recommends dumb-init curl \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

# Копируем продакшен зависимости и собранное приложение
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/

# Переключаемся на пользователя nodejs
USER nodejs

# Expose порт
EXPOSE 3001

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3001

# Рабочая директория для API
WORKDIR /app/apps/api

# Запускаем приложение с помощью dumb-init для правильной обработки сигналов
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]

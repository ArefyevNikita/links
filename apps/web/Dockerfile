# Multi-stage build для Web
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Копируем только файлы зависимостей для лучшего кэширования
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Устанавливаем зависимости с кэшированием
RUN npm ci --ignore-scripts --prefer-offline --no-audit

# Копируем исходный код
COPY apps/web ./apps/web

# Собираем приложение
WORKDIR /app/apps/web
RUN npm run build

# Продакшен стадия с nginx
FROM nginx:alpine AS runner

# Копируем конфигурацию nginx
COPY apps/web/nginx.conf /etc/nginx/nginx.conf

# Копируем собранное приложение
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Создаем пользователя nginx и директории одной командой
RUN addgroup -g 101 -S nginx || true \
    && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx || true \
    && mkdir -p /var/cache/nginx/{client_temp,proxy_temp,fastcgi_temp,uwsgi_temp,scgi_temp} \
    && chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Переключаемся на пользователя nginx
USER nginx

# Expose порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]

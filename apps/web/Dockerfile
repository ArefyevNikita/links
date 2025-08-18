# Multi-stage build для Web
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Устанавливаем зависимости
RUN npm ci --ignore-scripts

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

# Создаем пользователя nginx (если не существует)
RUN addgroup -g 101 -S nginx || true
RUN adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx || true

# Устанавливаем правильные права
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chown -R nginx:nginx /var/cache/nginx
RUN chown -R nginx:nginx /var/log/nginx
RUN chown -R nginx:nginx /etc/nginx/conf.d

# Создаем директории для nginx
RUN mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp \
    && chown -R nginx:nginx /var/cache/nginx

# Переключаемся на пользователя nginx
USER nginx

# Expose порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]

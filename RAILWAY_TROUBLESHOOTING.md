# 🚨 Railway Deployment Troubleshooting Guide

## 🔍 Диагностика проблемы

### 1. Проверьте health check endpoint
После деплоя, проверьте:
```
https://companion-app-production-0cc9.up.railway.app/api/health
```

**Ожидаемый ответ:**
```json
{
  "status": "healthy",
  "message": "All environment variables are set",
  "timestamp": "2025-08-02T..."
}
```

**Если есть ошибка:**
```json
{
  "status": "error",
  "message": "Missing environment variables",
  "missing": ["DATABASE_URL", "OPENAI_API_KEY"]
}
```

### 2. Проверьте базовый API endpoint
```
https://companion-app-production-0cc9.up.railway.app/api/test
```

**Ожидаемый ответ:**
```json
{
  "status": "success",
  "message": "Basic API endpoint is working",
  "timestamp": "2025-08-02T...",
  "environment": "production"
}
```

## 🛠️ Пошаговое решение

### Шаг 1: Проверьте переменные окружения в Railway

1. **Откройте Railway Dashboard**
2. **Перейдите в ваш проект**
3. **Выберите сервис companion-app**
4. **Перейдите в раздел "Variables"**
5. **Убедитесь, что все переменные установлены:**

```bash
# Обязательные переменные:
DATABASE_URL=postgresql://username:password@host:port/database
VECTOR_DB=postgresql
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_****
CLERK_SECRET_KEY=sk_test_****
OPENAI_API_KEY=sk-****
UPSTASH_REDIS_REST_URL=https://****
UPSTASH_REDIS_REST_TOKEN=AZ****

# Дополнительные переменные Clerk:
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Шаг 2: Удалите Supabase переменные

**Убедитесь, что эти переменные НЕ установлены:**
- `SUPABASE_URL`
- `SUPABASE_PRIVATE_KEY`

### Шаг 3: Проверьте PostgreSQL сервис

1. **Убедитесь, что PostgreSQL сервис добавлен**
2. **Скопируйте DATABASE_URL из PostgreSQL сервиса**
3. **Установите VECTOR_DB=postgresql**

### Шаг 4: Перезапустите сервис

1. **В Railway Dashboard выберите ваш сервис**
2. **Нажмите "Deploy" или "Redeploy"**
3. **Дождитесь завершения деплоя**

## 🔍 Анализ логов

### Проверьте логи Railway:

1. **Откройте Railway Dashboard**
2. **Выберите ваш сервис**
3. **Перейдите в раздел "Logs"**
4. **Ищите следующие сообщения:**

**✅ Успешная инициализация:**
```
INFO: PostgreSQL with pgvector initialized successfully.
```

**❌ Ошибки:**
```
ERROR: DATABASE_URL is not set
ERROR: Failed to initialize MemoryManager
ERROR: Failed to get MemoryManager instance
```

## 🚨 Частые проблемы и решения

### Проблема 1: "DATABASE_URL is not set"
**Решение:**
1. Добавьте PostgreSQL сервис в Railway
2. Скопируйте DATABASE_URL из PostgreSQL сервиса
3. Добавьте переменную в companion-app сервис

### Проблема 2: "Failed to connect to PostgreSQL"
**Решение:**
1. Убедитесь, что PostgreSQL сервис запущен
2. Проверьте правильность DATABASE_URL
3. Убедитесь, что VECTOR_DB=postgresql

### Проблема 3: "pgvector extension not available"
**Решение:**
1. Приложение автоматически создаст pgvector расширение
2. Убедитесь, что PostgreSQL сервис поддерживает расширения
3. Проверьте логи на наличие ошибок инициализации

### Проблема 4: "Clerk authentication failed"
**Решение:**
1. Проверьте правильность Clerk ключей
2. Убедитесь, что домен добавлен в Clerk
3. Проверьте переменные NEXT_PUBLIC_CLERK_*

## 🧪 Тестирование

### 1. Тест health check
```bash
curl https://companion-app-production-0cc9.up.railway.app/api/health
```

### 2. Тест базового API
```bash
curl https://companion-app-production-0cc9.up.railway.app/api/test
```

### 3. Тест главной страницы
```bash
curl https://companion-app-production-0cc9.up.railway.app/
```

## 📞 Поддержка

### Полезные команды Railway CLI:
```bash
# Установка Railway CLI
npm install -g @railway/cli

# Логин
railway login

# Проверка статуса
railway status

# Просмотр логов
railway logs

# Переменные окружения
railway variables

# Перезапуск сервиса
railway service restart
```

### Полезные ссылки:
- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Documentation](https://docs.railway.app/reference/cli)
- [PostgreSQL on Railway](https://docs.railway.app/databases/postgresql)
- [Environment Variables](https://docs.railway.app/deploy/environment-variables)

## 🎯 Ожидаемый результат

После правильной настройки:
- ✅ Health check возвращает "healthy"
- ✅ Тестовый API endpoint работает
- ✅ Главная страница загружается
- ✅ Логи показывают успешную инициализацию PostgreSQL
- ✅ Приложение готово к использованию 
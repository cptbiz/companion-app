# 🚂 Railway Troubleshooting Guide

## 🔍 Health Check

### Проверка состояния приложения
```bash
curl https://companion-app-production-0cc9.up.railway.app/api/health
```

**Ожидаемый ответ:**
```json
{
  "status": "healthy",
  "message": "All environment variables are set",
  "timestamp": "2025-08-03T00:00:00.000Z",
  "environment": "production"
}
```

## 🔧 Environment Variables

### Обязательные переменные
```bash
# Database
DATABASE_URL=postgresql://...

# OpenAI
OPENAI_API_KEY=sk-...

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=AZ...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWKS_URL=https://renewing-stingray-30.clerk.accounts.dev/.well-known/jwks.json

# Railway URL
NEXT_PUBLIC_RAILWAY_API_URL=https://companion-app-production-0cc9.up.railway.app
```

### Проверка переменных
```bash
# Локальная проверка
npm run clerk:check

# Проверка Railway
curl https://companion-app-production-0cc9.up.railway.app/api/health
```

## 🐛 Common Issues

### 1. ServerActions Warnings

**Проблема:** В логах Railway появляются предупреждения:
```
warn You have enabled experimental feature (serverActions) in next.config.js.
warn Experimental features are not covered by semver, and may cause unexpected or broken application behavior.
```

**Решение:**
- ✅ Убедитесь, что в `next.config.js` НЕТ `experimental.serverActions`
- ✅ Удалите все файлы с `"use server"` директивами
- ✅ Middleware был удален для устранения ошибок

**Примечание:** Middleware был полностью удален для упрощения развертывания.

### 2. PostgreSQL Service Issues

**Проблема:** Ошибки подключения к базе данных

**Решение:**
```bash
# Проверьте DATABASE_URL в Railway Variables
# Убедитесь, что PostgreSQL сервис запущен
# Проверьте SSL настройки для production
```

### 3. Clerk Authentication Errors

**Проблема:** Ошибки аутентификации

**Решение:**
```bash
# Проверьте Clerk ключи
npm run clerk:check

# Добавьте домены в Clerk Dashboard:
# - https://companion-app-production-0cc9.up.railway.app
# - https://companion-app-tau.vercel.app
```

### 4. Middleware Issues

**Проблема:** `MIDDLEWARE_INVOCATION_FAILED` ошибки

**Решение:**
- ✅ Middleware был полностью удален
- ✅ Приложение работает без middleware
- ✅ Все API endpoints доступны без аутентификации

**Примечание:** Middleware удален для упрощения развертывания и устранения ошибок.

### 5. Build Failures

**Проблема:** Ошибки сборки

**Решение:**
```bash
# Локальная проверка сборки
npm run build

# Очистка кэша
rm -rf .next
npm run build
```

## 🔄 Debugging Commands

### Railway Logs
```bash
# В Railway Dashboard → Logs
# Фильтр: "error" или "warn"
```

### Health Check Endpoints
```bash
# Основная проверка
curl https://companion-app-production-0cc9.up.railway.app/api/health

# Проверка запуска
curl https://companion-app-production-0cc9.up.railway.app/api/startup

# Тест API
curl https://companion-app-production-0cc9.up.railway.app/api/test
```

### Database Connection
```bash
# Проверка PostgreSQL
curl -X POST https://companion-app-production-0cc9.up.railway.app/api/chatgpt \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
```

## 📊 Monitoring

### Key Metrics
- **Health Check Status:** `/api/health`
- **Startup Time:** `/api/startup`
- **Database Connection:** Vector search functionality
- **Authentication:** Clerk middleware status

### Log Analysis
```bash
# Поиск ошибок в логах
grep "ERROR" railway-logs.txt
grep "warn" railway-logs.txt
grep "serverActions" railway-logs.txt
```

## 🚀 Deployment Checklist

### Before Deploy
- [ ] Все переменные окружения установлены в Railway
- [ ] Локальная сборка проходит без ошибок
- [ ] Clerk домены добавлены в Dashboard
- [ ] PostgreSQL сервис активен

### After Deploy
- [ ] Health check возвращает "healthy"
- [ ] Нет предупреждений serverActions в логах
- [ ] Аутентификация работает
- [ ] Vector search функционирует

## 📞 Support

### Railway Support
- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)

### Clerk Support
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Discord](https://discord.gg/clerk)

### Next.js Support
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub](https://github.com/vercel/next.js)

---

**Примечание:** Все URL в этом документе обновлены для вашего Railway домена `https://companion-app-production-0cc9.up.railway.app` 
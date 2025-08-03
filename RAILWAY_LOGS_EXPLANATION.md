# 📝 Railway Logs Explanation

## 🔍 Почему Next.js показывает localhost в логах

### Проблема
В Railway логах вы видите:
```
- ready started server on 0.0.0.0:8080, url: http://localhost:8080
```

### Причина
Это **нормальное поведение** Next.js. Next.js всегда показывает localhost в своих логах, даже в продакшне, потому что:

1. **Next.js запускается локально** внутри контейнера
2. **localhost:8080** - это внутренний адрес сервера
3. **Railway проксирует** запросы с внешнего URL на этот внутренний адрес

### ✅ Это НЕ проблема

**Ваше приложение работает правильно:**
- ✅ **Внешний URL**: `https://companion-app-production-0cc9.up.railway.app`
- ✅ **Внутренний адрес**: `http://localhost:8080` (в контейнере)
- ✅ **Проксирование**: Railway автоматически направляет трафик

### 🔧 Как проверить, что все работает

#### 1. Health Check
```bash
curl https://companion-app-production-0cc9.up.railway.app/api/health
```

**Ожидаемый ответ:**
```json
{
  "status": "healthy",
  "message": "All environment variables are set",
  "timestamp": "2025-08-03T...",
  "environment": "production"
}
```

#### 2. Startup Check
```bash
curl https://companion-app-production-0cc9.up.railway.app/api/startup
```

**Ожидаемый ответ:**
```json
{
  "status": "startup_ready",
  "message": "Application is ready to start",
  "serverUrl": "https://companion-app-production-0cc9.up.railway.app",
  "environment": "production"
}
```

#### 3. Откройте в браузере
```
https://companion-app-production-0cc9.up.railway.app
```

### 📊 Правильные логи Railway

**✅ Хорошие логи:**
```
🚀 Railway Production Server
=====================================

📋 Server Information:
   ✅ Production URL: https://companion-app-production-0cc9.up.railway.app
   ✅ Environment: production
   ✅ Port: 8080
   ✅ Note: Next.js will show localhost:8080 in logs, but app runs on Railway URL

🔍 Health Check Endpoints:
   - Health: /api/health
   - Test: /api/test
   - Startup: /api/startup

🌐 Your Domains:
   - Railway: https://companion-app-production-0cc9.up.railway.app
   - Vercel (Latest): https://companion-app-tau.vercel.app
   - Vercel (Git): https://companion-app-git-main-itcbrio.vercel.app

✅ Starting server...

- ready started server on 0.0.0.0:8080, url: http://localhost:8080
```

### 🚨 Когда стоит беспокоиться

**❌ Проблемные логи:**
```
ERROR: Failed to start server
ERROR: Port already in use
ERROR: Database connection failed
```

### 🔍 Диагностика

#### Если приложение не отвечает:
1. **Проверьте health check**: `/api/health`
2. **Проверьте startup**: `/api/startup`
3. **Проверьте Railway Variables**
4. **Проверьте логи на ошибки**

#### Если видите ошибки:
1. **DATABASE_URL** - проверьте PostgreSQL сервис
2. **CLERK_*** - проверьте Clerk ключи
3. **OPENAI_API_KEY** - проверьте OpenAI ключ

### 📚 Полезные команды

#### Локальная проверка
```bash
npm run build
npm start
```

#### Проверка Railway
```bash
curl https://companion-app-production-0cc9.up.railway.app/api/health
curl https://companion-app-production-0cc9.up.railway.app/api/startup
```

#### Проверка доменов
```bash
npm run domains:test
```

### 🎯 Заключение

**localhost:8080 в логах - это нормально!**

- ✅ Приложение работает на правильном Railway URL
- ✅ Next.js показывает внутренний адрес контейнера
- ✅ Railway проксирует трафик автоматически
- ✅ Все health checks должны проходить успешно

**Главное:** Проверяйте внешний URL `https://companion-app-production-0cc9.up.railway.app`, а не localhost в логах.

---

**Примечание:** Это стандартное поведение Next.js в контейнеризированных средах. Не пытайтесь изменить это - это может сломать приложение. 
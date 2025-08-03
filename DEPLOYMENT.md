# 🚀 Развертывание Companion App

## 📋 Обзор архитектуры

- **Backend (Railway)**: API, база данных, Redis
- **Frontend (Vercel)**: Next.js приложение
- **База данных**: PostgreSQL с pgvector
- **Кэш**: Redis (Upstash)

## 🔧 Шаг 1: Настройка Railway (Backend)

### 1.1 Создание проекта на Railway

1. Перейдите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. Создайте новый проект
4. Выберите "Deploy from GitHub repo"
5. Выберите репозиторий `companion-app`

### 1.2 Настройка переменных окружения

Добавьте следующие переменные в Railway:

```bash
# База данных
DATABASE_URL=postgresql://username:password@host:port/database

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_****
CLERK_SECRET_KEY=sk_test_****
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# OpenAI
OPENAI_API_KEY=sk-****

# Vector Database (Supabase)
VECTOR_DB=supabase
SUPABASE_URL=https://****
SUPABASE_PRIVATE_KEY=eyJ****

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://****
UPSTASH_REDIS_REST_TOKEN=AZ****

# Дополнительные сервисы
REPLICATE_API_TOKEN=r8_****
TWILIO_ACCOUNT_SID=AC***
TWILIO_AUTH_TOKEN=*****
```

### 1.3 Настройка базы данных

1. В Railway добавьте PostgreSQL плагин
2. Скопируйте `DATABASE_URL` из настроек PostgreSQL
3. Выполните миграцию:

```sql
-- Выполните SQL из файла pgvector.sql
```

## 🌐 Шаг 2: Настройка Vercel (Frontend)

### 2.1 Создание проекта на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Создайте новый проект
4. Импортируйте репозиторий `companion-app`

### 2.2 Настройка переменных окружения

Добавьте следующие переменные в Vercel:

```bash
# Railway API URL
NEXT_PUBLIC_RAILWAY_API_URL=https://companion-app-production-0cc9.up.railway.app

# Clerk (те же ключи что и в Railway)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_****
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 2.3 Настройка домена

1. В настройках Vercel добавьте кастомный домен
2. Настройте DNS записи
3. Включите HTTPS

## 🔄 Шаг 3: Настройка CORS

Добавьте в Railway переменную:

```bash
NEXT_PUBLIC_FRONTEND_URL=https://your-vercel-app.vercel.app
```

## 📊 Шаг 4: Мониторинг

### Railway
- Логи: Railway Dashboard → Logs
- Метрики: Railway Dashboard → Metrics
- База данных: Railway Dashboard → PostgreSQL

### Vercel
- Логи: Vercel Dashboard → Functions
- Аналитика: Vercel Dashboard → Analytics
- Производительность: Vercel Dashboard → Speed Insights

## 🚨 Troubleshooting

### Проблемы с подключением
1. Проверьте CORS настройки
2. Убедитесь что все переменные окружения установлены
3. Проверьте логи в Railway и Vercel

### Проблемы с базой данных
1. Проверьте подключение к PostgreSQL
2. Убедитесь что pgvector установлен
3. Проверьте миграции

### Проблемы с аутентификацией
1. Проверьте Clerk ключи
2. Убедитесь что домены настроены в Clerk
3. Проверьте redirect URLs

## 📞 Поддержка

- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Clerk: [clerk.com/docs](https://clerk.com/docs) 
# 🚀 Настройка Railway для Companion App

## 📋 Переменные окружения для Railway

### 1. Аутентификация (Clerk)
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_****
CLERK_SECRET_KEY=sk_test_****
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 2. База данных (PostgreSQL Railway)
```bash
DATABASE_URL=postgresql://username:password@host:port/database
```

### 3. AI сервисы (OpenAI)
```bash
OPENAI_API_KEY=sk-****
```

### 4. Vector Database (PostgreSQL Railway)
```bash
VECTOR_DB=supabase
SUPABASE_URL=postgresql://username:password@host:port/database
SUPABASE_PRIVATE_KEY=postgres
```

### 5. Кэш (Redis/Upstash)
```bash
UPSTASH_REDIS_REST_URL=https://****
UPSTASH_REDIS_REST_TOKEN=AZ****
```

### 6. Дополнительные сервисы
```bash
REPLICATE_API_TOKEN=r8_****
TWILIO_ACCOUNT_SID=AC***
TWILIO_AUTH_TOKEN=*****
```

## 🔧 Шаги настройки

1. **Добавьте PostgreSQL** в Railway Dashboard
2. **Скопируйте DATABASE_URL** из PostgreSQL сервиса
3. **Используйте тот же DATABASE_URL** для SUPABASE_URL
4. **Добавьте все переменные** в основной сервис
5. **Перезапустите приложение**

## 🚨 Важные моменты

- **DATABASE_URL** должен быть из PostgreSQL сервиса Railway
- **SUPABASE_URL** используйте тот же DATABASE_URL
- **SUPABASE_PRIVATE_KEY** можно оставить как "postgres"
- Все переменные с NEXT_PUBLIC_ доступны на клиенте
- Остальные переменные только на сервере

## 📞 Поддержка

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Clerk Docs: [clerk.com/docs](https://clerk.com/docs) 
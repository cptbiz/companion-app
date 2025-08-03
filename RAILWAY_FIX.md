# 🚀 Railway Deployment Fix - PostgreSQL Only

## 🔍 Проблема

Ваше приложение companion-app получало ошибку 500 при деплое на Railway, потому что:

1. **Конфигурация использовала Supabase** для векторного хранилища
2. **Railway предоставляет PostgreSQL** с поддержкой pgvector
3. **Конфликт конфигураций** между Supabase и PostgreSQL

## ✅ Решение

### Что было изменено:

1. **Обновлен `src/app/utils/memory.ts`**:
   - Удалена зависимость от Supabase клиента
   - Добавлена прямая поддержка PostgreSQL с pgvector
   - Автоматическая инициализация pgvector расширения
   - Прямые SQL запросы для векторного поиска

2. **Обновлен `env.example`**:
   - Удалены Supabase переменные (`SUPABASE_URL`, `SUPABASE_PRIVATE_KEY`)
   - Установлен `VECTOR_DB=postgresql`
   - Используется только `DATABASE_URL` для всех операций

3. **Добавлены зависимости**:
   - `pg` - PostgreSQL клиент для Node.js
   - `@types/pg` - TypeScript типы

4. **Создан helper скрипт**:
   - `scripts/railway-setup.js` - помощник по настройке
   - `npm run railway:setup` - запуск помощника

## 🔧 Настройка Railway

### 1. Добавьте PostgreSQL сервис
```bash
# В Railway Dashboard:
# 1. Создайте новый проект
# 2. Добавьте PostgreSQL сервис
# 3. Скопируйте DATABASE_URL
```

### 2. Настройте переменные окружения
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

### 3. Удалите Supabase переменные
```bash
# НЕ добавляйте эти переменные:
# SUPABASE_URL
# SUPABASE_PRIVATE_KEY
```

## 🚀 Деплой

### 1. Подготовка
```bash
# Убедитесь, что все изменения закоммичены
git add .
git commit -m "Fix Railway deployment - use PostgreSQL only"
git push
```

### 2. Настройка Railway
```bash
# Запустите помощник по настройке
npm run railway:setup
```

### 3. Деплой
```bash
# Railway автоматически деплоит при изменениях в git
# Или используйте Railway CLI:
railway up
```

## 🔍 Проверка

### 1. Логи Railway
```bash
# Проверьте логи в Railway Dashboard
# Должно быть сообщение:
# "INFO: PostgreSQL with pgvector initialized successfully."
```

### 2. Тест приложения
```bash
# Откройте ваше приложение
# Попробуйте создать чат с компаньоном
# Проверьте, что векторный поиск работает
```

## 🛠️ Технические детали

### PostgreSQL с pgvector
- **Автоматическая инициализация** pgvector расширения
- **Создание таблицы** `documents` для векторного хранилища
- **Функция поиска** `match_documents` для векторного поиска
- **SSL поддержка** для production окружения

### Векторный поиск
- **OpenAI Embeddings** для создания векторных представлений
- **Косинусное сходство** для поиска похожих документов
- **Фильтрация по метаданным** для точного поиска
- **Ограничение результатов** (3 документа)

### Обработка ошибок
- **Graceful fallback** при ошибках векторного поиска
- **Логирование ошибок** для отладки
- **Возврат пустого массива** при сбоях

## 📞 Поддержка

### Полезные ссылки:
- [Railway Documentation](https://docs.railway.app)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [PostgreSQL Node.js Driver](https://node-postgres.com/)

### Команды для отладки:
```bash
# Проверка логов
railway logs

# Проверка переменных окружения
railway variables

# Перезапуск сервиса
railway service restart
```

## 🎯 Результат

После применения этих изменений:
- ✅ Приложение будет использовать только PostgreSQL
- ✅ Векторный поиск будет работать через pgvector
- ✅ Ошибка 500 будет исправлена
- ✅ Деплой на Railway будет успешным
- ✅ Упрощена конфигурация (убраны Supabase зависимости) 
# 🗄️ Настройка PostgreSQL на Railway

## 🚀 Быстрое добавление PostgreSQL

### Шаг 1: Добавление PostgreSQL сервиса

1. **Перейдите в Railway Dashboard**: [railway.app](https://railway.app)
2. **Выберите ваш проект** `companion-app`
3. **Нажмите "New Service"**
4. **Выберите "Database"** → **"PostgreSQL"**

### Шаг 2: Получение DATABASE_URL

После создания PostgreSQL:

1. **Перейдите в настройки PostgreSQL сервиса**
2. **Скопируйте DATABASE_URL** из раздела "Connect"
3. **Добавьте в переменные окружения** основного сервиса

### Шаг 3: Настройка переменных окружения

В основном сервисе добавьте:

```bash
# База данных
DATABASE_URL=postgresql://username:password@host:port/database

# Vector Database (используем PostgreSQL с pgvector)
VECTOR_DB=supabase
SUPABASE_URL=postgresql://username:password@host:port/database
SUPABASE_PRIVATE_KEY=your_private_key
```

## 🔧 Ручная настройка через CLI

### Установка Railway CLI:

```bash
npm install -g @railway/cli
railway login
```

### Добавление PostgreSQL:

```bash
# Подключение к проекту
railway link

# Добавление PostgreSQL
railway add

# Просмотр переменных окружения
railway variables
```

## 📝 Выполнение миграций

### Автоматически (рекомендуется):

```bash
# Установка зависимостей
npm install pg @types/pg

# Выполнение миграций
node scripts/setup-database.js setup
```

### Вручную:

1. **Подключитесь к PostgreSQL** через Railway Dashboard
2. **Выполните SQL** из файла `pgvector.sql`

## 🧪 Тестирование подключения

```bash
# Тест подключения
node scripts/setup-database.js test

# Проверка переменных окружения
railway variables
```

## 🔍 Проверка pgvector

После настройки проверьте что pgvector установлен:

```sql
-- Проверка расширения
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Создание тестовой таблицы
CREATE TABLE test_vectors (
  id SERIAL PRIMARY KEY,
  embedding vector(1536),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Вставка тестовых данных
INSERT INTO test_vectors (content) 
VALUES ('Тестовый вектор для проверки pgvector');
```

## 🚨 Troubleshooting

### Ошибка подключения:

```bash
❌ Ошибка: ECONNREFUSED
```

**Решение:**
1. Проверьте что PostgreSQL сервис запущен
2. Убедитесь что DATABASE_URL корректный
3. Проверьте сетевые настройки Railway

### Ошибка pgvector:

```bash
❌ Ошибка: extension "vector" does not exist
```

**Решение:**
1. Убедитесь что pgvector установлен в PostgreSQL
2. Выполните: `CREATE EXTENSION IF NOT EXISTS vector;`

### Ошибка SSL:

```bash
❌ Ошибка: SSL connection required
```

**Решение:**
Добавьте в DATABASE_URL: `?sslmode=require`

## 📊 Мониторинг базы данных

### Railway Dashboard:
- **Metrics** → Просмотр метрик PostgreSQL
- **Logs** → Логи базы данных
- **Settings** → Настройки подключения

### Полезные команды:

```sql
-- Просмотр таблиц
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Просмотр размеров таблиц
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public';

-- Проверка подключений
SELECT * FROM pg_stat_activity;
```

## 🔐 Безопасность

### Рекомендации:

1. **Используйте SSL** для подключений
2. **Ограничьте доступ** по IP если возможно
3. **Регулярно обновляйте** пароли
4. **Мониторьте** подключения

### Переменные безопасности:

```bash
# SSL режим
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require

# Таймауты
DATABASE_TIMEOUT=30000
DATABASE_POOL_SIZE=10
```

## 📈 Производительность

### Настройки для оптимизации:

```sql
-- Увеличение shared_buffers
ALTER SYSTEM SET shared_buffers = '256MB';

-- Настройка work_mem
ALTER SYSTEM SET work_mem = '4MB';

-- Включение параллельных запросов
ALTER SYSTEM SET max_parallel_workers_per_gather = 2;
```

## 🔄 Backup и восстановление

### Создание backup:

```bash
# Через Railway CLI
railway run pg_dump -h host -U username -d database > backup.sql

# Через psql
pg_dump postgresql://user:pass@host:port/db > backup.sql
```

### Восстановление:

```bash
# Восстановление из backup
psql postgresql://user:pass@host:port/db < backup.sql
```

## 📞 Поддержка

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **PostgreSQL Docs**: [postgresql.org/docs](https://www.postgresql.org/docs)
- **pgvector Docs**: [github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)

---

**⏱️ Время настройки**: 5-10 минут  
**💰 Стоимость**: Бесплатно (начальный план Railway)  
**🔧 Сложность**: Простая 
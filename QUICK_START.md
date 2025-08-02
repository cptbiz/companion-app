# ⚡ Быстрый старт - Companion App

## 🎯 Что мы развертываем

- **Backend**: Railway (API + PostgreSQL + Redis)
- **Frontend**: Vercel (Next.js приложение)
- **Аутентификация**: Clerk
- **AI**: OpenAI + Vector Database

## 🚀 Быстрое развертывание

### 1️⃣ Подготовка

```bash
# Клонируйте репозиторий
git clone https://github.com/cptbiz/companion-app.git
cd companion-app

# Установите зависимости
npm install
```

### 2️⃣ Настройка Railway (Backend)

1. **Создайте аккаунт**: [railway.app](https://railway.app)
2. **Создайте проект**: New Project → Deploy from GitHub
3. **Добавьте PostgreSQL**: Add Service → PostgreSQL
4. **Настройте переменные**: Variables → Добавьте все из `env.example`

### 3️⃣ Настройка Vercel (Frontend)

1. **Создайте аккаунт**: [vercel.com](https://vercel.com)
2. **Импортируйте проект**: Import Git Repository
3. **Настройте переменные**: Environment Variables → Добавьте:
   - `NEXT_PUBLIC_RAILWAY_API_URL` (URL вашего Railway приложения)
   - Clerk ключи (те же что и в Railway)

### 4️⃣ Автоматическое развертывание

```bash
# Запустите скрипт развертывания
./deploy.sh
```

## 🔑 Необходимые API ключи

### Clerk (Аутентификация)
1. Зарегистрируйтесь на [clerk.com](https://clerk.com)
2. Создайте приложение
3. Скопируйте `publishable_key` и `secret_key`

### OpenAI
1. Зарегистрируйтесь на [openai.com](https://openai.com)
2. Создайте API ключ в [platform.openai.com](https://platform.openai.com)

### Supabase (Vector Database)
1. Зарегистрируйтесь на [supabase.com](https://supabase.com)
2. Создайте проект
3. Скопируйте `URL` и `anon key`

### Upstash (Redis)
1. Зарегистрируйтесь на [upstash.com](https://upstash.com)
2. Создайте Redis базу данных
3. Скопируйте `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN`

## 📊 Мониторинг

- **Railway**: Dashboard → Logs, Metrics, PostgreSQL
- **Vercel**: Dashboard → Functions, Analytics
- **Clerk**: Dashboard → Users, Sessions

## 🚨 Частые проблемы

### Ошибка CORS
- Проверьте `NEXT_PUBLIC_RAILWAY_API_URL` в Vercel
- Убедитесь что домены настроены в Clerk

### Ошибка базы данных
- Проверьте `DATABASE_URL` в Railway
- Убедитесь что PostgreSQL запущен

### Ошибка аутентификации
- Проверьте Clerk ключи
- Убедитесь что redirect URLs настроены

## 📞 Поддержка

- 📖 **Подробное руководство**: `DEPLOYMENT.md`
- 🚀 **Автоматический скрипт**: `./deploy.sh`
- 🔧 **Переменные окружения**: `env.example`

---

**⏱️ Время развертывания**: 15-30 минут
**💰 Стоимость**: Бесплатно (начальные планы)
**🌐 Результат**: Работающее AI приложение с аутентификацией 
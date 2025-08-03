# 🔐 Clerk Authentication Setup

## 📋 Обзор

Clerk предоставляет аутентификацию для вашего приложения. Этот документ описывает настройку Clerk с вашими ключами.

## 🚀 Быстрая настройка

### 1. Переменные окружения

Добавьте следующие переменные в Railway:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_****
CLERK_SECRET_KEY=sk_test_****
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_JWKS_URL=https://renewing-stingray-30.clerk.accounts.dev/.well-known/jwks.json
```

### 2. Ваши Clerk ключи

**JWKS URL:**
```
https://renewing-stingray-30.clerk.accounts.dev/.well-known/jwks.json
```

**PEM Public Key:**
```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2R6lA9YuB2MoB/xL3wFd
4YxTajc9UulVr1hrFZd6mUgTeBoFT/ANUGYfjQy79sr8soOQcbxsq5v2WJF1o1YS
Lj4RQNOIknHdfCALyimb2j43psw760Bx8naMapJQDrFfOFtT+ybRdZGyReVEpLjx
BlUH1DXycQBhcd2EVMFZkhTzcBGoVMOUPA7qveWd9FrPGdadpsDMOulmafnJXOon
gFUsSz+pqUVfmS0FbeECKLfPCLVv1hw1gfXbymrG4ZPh3msu2znzL+zffdRoT0f0
VDFHB6Sbx99muzi1xBHQfhqJGloJ+/VJn6hBHrd/UvYTBByEWcp7ByhbDqJTHMTQ
9wIDAQAB
-----END PUBLIC KEY-----
```

## 🔧 Настройка в Railway

### 1. Откройте Railway Dashboard
- Перейдите в ваш проект `companion-app`
- Выберите вкладку "Variables"

### 2. Добавьте переменные
```bash
# Скопируйте и вставьте в Railway Variables:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_****
CLERK_SECRET_KEY=sk_test_****
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_JWKS_URL=https://renewing-stingray-30.clerk.accounts.dev/.well-known/jwks.json
```

### 3. Замените placeholder значения
- `pk_test_****` → ваш реальный publishable key
- `sk_test_****` → ваш реальный secret key

## 🌐 Домены

### Разрешенные домены в Clerk Dashboard:
1. `https://companion-app-production-0cc9.up.railway.app`
2. `https://companion-app-tau.vercel.app`
3. `https://companion-app-git-main-itcbrio.vercel.app`

## 🔍 Проверка настройки

### 1. Health Check
```bash
curl https://companion-app-production-0cc9.up.railway.app/api/health
```

### 2. Startup Check
```bash
curl https://companion-app-production-0cc9.up.railway.app/api/startup
```

### 3. Тест аутентификации
```bash
curl https://companion-app-production-0cc9.up.railway.app/api/test
```

## 🛠️ Устранение неполадок

### Ошибка: "Missing Clerk Secret Key"
- Проверьте, что `CLERK_SECRET_KEY` установлен в Railway
- Убедитесь, что ключ начинается с `sk_test_` или `sk_live_`

### Ошибка: "Invalid JWT"
- Проверьте `CLERK_JWKS_URL`
- Убедитесь, что домен добавлен в Clerk Dashboard

### Ошибка: "CORS Error"
- Добавьте домены в Clerk Dashboard
- Проверьте `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## 📚 Полезные ссылки

- [Clerk Documentation](https://clerk.com/docs)
- [JWKS Documentation](https://clerk.com/docs/backend-requests/making/jwt-verification)
- [Railway Variables](https://docs.railway.app/deploy/environment-variables)

## 🔄 Обновление ключей

Если нужно обновить ключи:

1. Получите новые ключи из Clerk Dashboard
2. Обновите переменные в Railway
3. Перезапустите деплой

```bash
# В Railway Dashboard:
# Variables → Edit → Update values → Redeploy
```

## ✅ Готово!

После настройки всех переменных:
1. Railway автоматически перезапустит приложение
2. Проверьте логи на наличие ошибок
3. Протестируйте аутентификацию

---

**Примечание:** Все ключи должны быть установлены в Railway Variables, а не в локальном `.env` файле для продакшена. 
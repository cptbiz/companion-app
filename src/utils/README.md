# 🚀 Утилиты Companion App

## 📋 Обзор

Этот модуль содержит все утилиты для логирования, обработки ошибок и мониторинга приложения.

## 📁 Структура файлов

```
src/utils/
├── logger.ts          # Логирование с разными уровнями
├── errorHandler.ts    # Обработка ошибок с типизацией
├── monitoring.ts      # Мониторинг производительности
├── index.ts          # Экспорт всех утилит
└── README.md         # Документация
```

## 🔧 Logger (`logger.ts`)

### Возможности:
- ✅ Разные уровни логирования (DEBUG, INFO, WARN, ERROR, FATAL)
- ✅ Контекстная информация (userId, sessionId)
- ✅ Форматированный вывод
- ✅ Интеграция с внешними сервисами (Sentry, LogRocket)

### Использование:

```typescript
import { logger } from '@/utils';

// Базовое логирование
logger.info('Пользователь зашел в систему', { userId: '123' });
logger.error('Ошибка базы данных', error, { table: 'users' });

// Специализированные методы
logger.logApiRequest('GET', '/api/users', 200, 150);
logger.logDatabaseError('SELECT', 'users', error);
logger.logAuthError('login', error);
logger.logAIError('OpenAI', 'chat_completion', error);
```

## 🚨 Error Handler (`errorHandler.ts`)

### Типы ошибок:
- **ValidationError** - Ошибки валидации (400)
- **AuthenticationError** - Ошибки аутентификации (401)
- **DatabaseError** - Ошибки базы данных (500)
- **AIServiceError** - Ошибки AI сервисов (500)
- **RateLimitError** - Превышение лимитов (429)
- **ExternalServiceError** - Ошибки внешних сервисов (500)
- **InternalError** - Внутренние ошибки (500)

### Использование:

```typescript
import { createError, handleError, ErrorType } from '@/utils';

// Создание ошибок
const validationError = createError(
  ErrorType.VALIDATION,
  'Неверный email',
  'INVALID_EMAIL',
  { email: 'test@' }
);

// Обработка ошибок
try {
  // какой-то код
} catch (error) {
  const appError = handleError(error, userId, sessionId);
  // Ошибка автоматически залогирована
}

// Повторные попытки
const result = await retryOperation(
  () => apiCall(),
  3, // maxRetries
  1000 // delay
);
```

## 📊 Monitoring (`monitoring.ts`)

### Возможности:
- ✅ Измерение производительности операций
- ✅ Метрики системы
- ✅ Проверка здоровья сервисов
- ✅ Статистика и аналитика

### Использование:

```typescript
import { measurePerformance, recordMetric, checkServiceHealth } from '@/utils';

// Измерение производительности
const result = await measurePerformance(
  'database_query',
  () => db.query('SELECT * FROM users'),
  userId,
  sessionId
);

// Запись метрик
recordMetric('api_calls', 1, 'count', { endpoint: '/api/users' });

// Проверка здоровья
const health = await checkServiceHealth('database', async () => {
  return await db.ping();
});
```

## 🛠️ Общие утилиты

### Валидация:
```typescript
import { validateEmail, validatePhone, sanitizeInput } from '@/utils';

const isValid = validateEmail('test@example.com');
const cleanInput = sanitizeInput('<script>alert("xss")</script>');
```

### Работа с данными:
```typescript
import { deepClone, pick, omit, chunk } from '@/utils';

const cloned = deepClone(originalObject);
const subset = pick(object, ['id', 'name']);
const withoutId = omit(object, ['id']);
const chunks = chunk(array, 10);
```

### Форматирование:
```typescript
import { formatBytes, formatDuration, formatDate } from '@/utils';

const size = formatBytes(1024); // "1 KB"
const time = formatDuration(1500); // "1.5s"
const date = formatDate(new Date()); // "15 января 2024, 14:30"
```

## 🔧 Настройка

### Переменные окружения:

```bash
# Уровень логирования
LOG_LEVEL=INFO

# Интеграция с внешними сервисами
SENTRY_DSN=your_sentry_dsn
LOGROCKET_APP_ID=your_logrocket_id
```

### Конфигурация в коде:

```typescript
import { logger } from '@/utils';

// Установка уровня логирования
logger.setLevel(LogLevel.DEBUG);

// Проверка текущего уровня
const currentLevel = logger.getLevel();
```

## 📈 Метрики и мониторинг

### Доступные метрики:

1. **Производительность**:
   - Время выполнения операций
   - Количество запросов
   - Процент успешных операций

2. **Системные**:
   - Использование CPU
   - Использование памяти
   - Сетевой трафик

3. **Здоровье сервисов**:
   - Статус базы данных
   - Статус внешних API
   - Время отклика

### Экспорт метрик:

```typescript
import { exportMetrics } from '@/utils';

const metrics = exportMetrics();
// Отправка в внешние системы мониторинга
```

## 🚨 Troubleshooting

### Проблемы с логированием:
1. Проверьте уровень логирования
2. Убедитесь что все переменные окружения установлены
3. Проверьте права доступа к файлам логов

### Проблемы с обработкой ошибок:
1. Убедитесь что все типы ошибок импортированы
2. Проверьте что ошибки правильно типизированы
3. Проверьте логи на наличие необработанных ошибок

### Проблемы с мониторингом:
1. Проверьте что метрики не превышают лимиты памяти
2. Убедитесь что health checks настроены правильно
3. Проверьте интеграцию с внешними сервисами

## 📚 Примеры использования

### API Route с логированием:

```typescript
import { logger, measurePerformance, handleError } from '@/utils';

export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    const result = await measurePerformance(
      'get_user_data',
      async () => {
        // Получение данных пользователя
        return await getUserData();
      },
      userId,
      sessionId
    );

    logger.logApiRequest('GET', '/api/user', 200, Date.now() - startTime);
    return Response.json(result);
    
  } catch (error) {
    const appError = handleError(error, userId, sessionId);
    return Response.json(
      { error: appError.message },
      { status: getHttpStatusCode(appError) }
    );
  }
}
```

### Middleware для логирования:

```typescript
import { logger } from '@/utils';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.logApiRequest(
      req.method,
      req.url,
      res.statusCode,
      duration,
      req.user?.id,
      req.session?.id
    );
  });
  
  next();
}
```

## 🔗 Интеграции

### Sentry:
```typescript
// В logger.ts
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}
```

### LogRocket:
```typescript
// В logger.ts
import LogRocket from 'logrocket';

if (process.env.LOGROCKET_APP_ID) {
  LogRocket.init(process.env.LOGROCKET_APP_ID);
}
```

### DataDog:
```typescript
// В monitoring.ts
import { datadogLogs } from '@datadog/browser-logs';

if (process.env.DATADOG_CLIENT_TOKEN) {
  datadogLogs.init({
    clientToken: process.env.DATADOG_CLIENT_TOKEN,
    site: 'datadoghq.eu'
  });
}
``` 
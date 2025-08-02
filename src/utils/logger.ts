// 🚀 Logger utility для Companion App
// Поддерживает разные уровни логирования и форматы

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const levelName = LogLevel[entry.level];
    const message = entry.message;
    const context = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
    const userId = entry.userId ? ` | User: ${entry.userId}` : '';
    const sessionId = entry.sessionId ? ` | Session: ${entry.sessionId}` : '';

    return `[${timestamp}] ${levelName}: ${message}${context}${userId}${sessionId}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private createEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error, userId?: string, sessionId?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      userId,
      sessionId
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error, userId?: string, sessionId?: string) {
    if (!this.shouldLog(level)) return;

    const entry = this.createEntry(level, message, context, error, userId, sessionId);
    const formattedMessage = this.formatMessage(entry);

    // Консольный вывод
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedMessage);
        if (error) {
          console.error('Stack trace:', error.stack);
        }
        break;
    }

    // В продакшене можно добавить отправку в внешние сервисы
    if (!this.isDevelopment && level >= LogLevel.ERROR) {
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(entry: LogEntry) {
    // Здесь можно добавить интеграцию с внешними сервисами
    // Например: Sentry, LogRocket, DataDog и т.д.
    
    // Пример для Sentry:
    // if (process.env.SENTRY_DSN) {
    //   Sentry.captureException(entry.error || new Error(entry.message), {
    //     extra: entry.context,
    //     user: entry.userId ? { id: entry.userId } : undefined
    //   });
    // }
  }

  // Публичные методы для логирования
  debug(message: string, context?: Record<string, any>, userId?: string, sessionId?: string) {
    this.log(LogLevel.DEBUG, message, context, undefined, userId, sessionId);
  }

  info(message: string, context?: Record<string, any>, userId?: string, sessionId?: string) {
    this.log(LogLevel.INFO, message, context, undefined, userId, sessionId);
  }

  warn(message: string, context?: Record<string, any>, userId?: string, sessionId?: string) {
    this.log(LogLevel.WARN, message, context, undefined, userId, sessionId);
  }

  error(message: string, error?: Error, context?: Record<string, any>, userId?: string, sessionId?: string) {
    this.log(LogLevel.ERROR, message, context, error, userId, sessionId);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>, userId?: string, sessionId?: string) {
    this.log(LogLevel.FATAL, message, context, error, userId, sessionId);
  }

  // Метод для логирования API запросов
  logApiRequest(method: string, url: string, statusCode: number, duration: number, userId?: string, sessionId?: string) {
    const context = {
      method,
      url,
      statusCode,
      duration: `${duration}ms`
    };

    const level = statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `${method} ${url} - ${statusCode} (${duration}ms)`;

    this.log(level, message, context, undefined, userId, sessionId);
  }

  // Метод для логирования ошибок базы данных
  logDatabaseError(operation: string, table: string, error: Error, userId?: string, sessionId?: string) {
    const context = {
      operation,
      table,
      errorType: error.name,
      errorMessage: error.message
    };

    this.error(`Database error in ${operation} on ${table}`, error, context, userId, sessionId);
  }

  // Метод для логирования ошибок аутентификации
  logAuthError(action: string, error: Error, userId?: string, sessionId?: string) {
    const context = {
      action,
      errorType: error.name,
      errorMessage: error.message
    };

    this.error(`Authentication error in ${action}`, error, context, userId, sessionId);
  }

  // Метод для логирования ошибок AI
  logAIError(provider: string, operation: string, error: Error, userId?: string, sessionId?: string) {
    const context = {
      provider,
      operation,
      errorType: error.name,
      errorMessage: error.message
    };

    this.error(`AI error in ${provider} ${operation}`, error, context, userId, sessionId);
  }

  // Установка уровня логирования
  setLevel(level: LogLevel) {
    this.level = level;
  }

  // Получение текущего уровня
  getLevel(): LogLevel {
    return this.level;
  }
}

// Создаем глобальный экземпляр логгера
const logger = new Logger(
  process.env.LOG_LEVEL ? 
    LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] || LogLevel.INFO : 
    LogLevel.INFO
);

export default logger; 
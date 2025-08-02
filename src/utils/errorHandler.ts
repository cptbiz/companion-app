// 🚀 Error Handler utility для Companion App
// Централизованная обработка ошибок с типизацией

import logger from './logger';

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  AI_SERVICE = 'AI_SERVICE',
  RATE_LIMIT = 'RATE_LIMIT',
  INTERNAL = 'INTERNAL',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface AppError extends Error {
  type: ErrorType;
  severity: ErrorSeverity;
  code?: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  retryable?: boolean;
  timestamp: string;
}

export class ValidationError extends Error implements AppError {
  public type = ErrorType.VALIDATION;
  public severity = ErrorSeverity.LOW;
  public code?: string;
  public context?: Record<string, any>;
  public userId?: string;
  public sessionId?: string;
  public retryable = false;
  public timestamp: string;

  constructor(message: string, code?: string, context?: Record<string, any>, userId?: string, sessionId?: string) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.context = context;
    this.userId = userId;
    this.sessionId = sessionId;
    this.timestamp = new Date().toISOString();
  }
}

export class AuthenticationError extends Error implements AppError {
  public type = ErrorType.AUTHENTICATION;
  public severity = ErrorSeverity.HIGH;
  public code?: string;
  public context?: Record<string, any>;
  public userId?: string;
  public sessionId?: string;
  public retryable = false;
  public timestamp: string;

  constructor(message: string, code?: string, context?: Record<string, any>, userId?: string, sessionId?: string) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.context = context;
    this.userId = userId;
    this.sessionId = sessionId;
    this.timestamp = new Date().toISOString();
  }
}

export class DatabaseError extends Error implements AppError {
  public type = ErrorType.DATABASE;
  public severity = ErrorSeverity.HIGH;
  public code?: string;
  public context?: Record<string, any>;
  public userId?: string;
  public sessionId?: string;
  public retryable = true;
  public timestamp: string;

  constructor(message: string, code?: string, context?: Record<string, any>, userId?: string, sessionId?: string) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.context = context;
    this.userId = userId;
    this.sessionId = sessionId;
    this.timestamp = new Date().toISOString();
  }
}

export class AIServiceError extends Error implements AppError {
  public type = ErrorType.AI_SERVICE;
  public severity = ErrorSeverity.MEDIUM;
  public code?: string;
  public context?: Record<string, any>;
  public userId?: string;
  public sessionId?: string;
  public retryable = true;
  public timestamp: string;

  constructor(message: string, code?: string, context?: Record<string, any>, userId?: string, sessionId?: string) {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
    this.context = context;
    this.userId = userId;
    this.sessionId = sessionId;
    this.timestamp = new Date().toISOString();
  }
}

export class RateLimitError extends Error implements AppError {
  public type = ErrorType.RATE_LIMIT;
  public severity = ErrorSeverity.MEDIUM;
  public code?: string;
  public context?: Record<string, any>;
  public userId?: string;
  public sessionId?: string;
  public retryable = true;
  public timestamp: string;

  constructor(message: string, code?: string, context?: Record<string, any>, userId?: string, sessionId?: string) {
    super(message);
    this.name = 'RateLimitError';
    this.code = code;
    this.context = context;
    this.userId = userId;
    this.sessionId = sessionId;
    this.timestamp = new Date().toISOString();
  }
}

export class ExternalServiceError extends Error implements AppError {
  public type = ErrorType.EXTERNAL_SERVICE;
  public severity = ErrorSeverity.MEDIUM;
  public code?: string;
  public context?: Record<string, any>;
  public userId?: string;
  public sessionId?: string;
  public retryable = true;
  public timestamp: string;

  constructor(message: string, code?: string, context?: Record<string, any>, userId?: string, sessionId?: string) {
    super(message);
    this.name = 'ExternalServiceError';
    this.code = code;
    this.context = context;
    this.userId = userId;
    this.sessionId = sessionId;
    this.timestamp = new Date().toISOString();
  }
}

export class InternalError extends Error implements AppError {
  public type = ErrorType.INTERNAL;
  public severity = ErrorSeverity.CRITICAL;
  public code?: string;
  public context?: Record<string, any>;
  public userId?: string;
  public sessionId?: string;
  public retryable = false;
  public timestamp: string;

  constructor(message: string, code?: string, context?: Record<string, any>, userId?: string, sessionId?: string) {
    super(message);
    this.name = 'InternalError';
    this.code = code;
    this.context = context;
    this.userId = userId;
    this.sessionId = sessionId;
    this.timestamp = new Date().toISOString();
  }
}

// Функция для создания ошибок
export function createError(
  type: ErrorType,
  message: string,
  code?: string,
  context?: Record<string, any>,
  userId?: string,
  sessionId?: string
): AppError {
  switch (type) {
    case ErrorType.VALIDATION:
      return new ValidationError(message, code, context, userId, sessionId);
    case ErrorType.AUTHENTICATION:
      return new AuthenticationError(message, code, context, userId, sessionId);
    case ErrorType.DATABASE:
      return new DatabaseError(message, code, context, userId, sessionId);
    case ErrorType.AI_SERVICE:
      return new AIServiceError(message, code, context, userId, sessionId);
    case ErrorType.RATE_LIMIT:
      return new RateLimitError(message, code, context, userId, sessionId);
    case ErrorType.EXTERNAL_SERVICE:
      return new ExternalServiceError(message, code, context, userId, sessionId);
    case ErrorType.INTERNAL:
      return new InternalError(message, code, context, userId, sessionId);
    default:
      return new InternalError(message, code, context, userId, sessionId);
  }
}

// Функция для обработки ошибок
export function handleError(error: Error | AppError, userId?: string, sessionId?: string): AppError {
  let appError: AppError;

  // Если это уже AppError, используем его
  if (isAppError(error)) {
    appError = error;
  } else {
    // Определяем тип ошибки по сообщению или имени
    let errorType = ErrorType.INTERNAL;
    
    if (error.message.includes('validation') || error.message.includes('Validation')) {
      errorType = ErrorType.VALIDATION;
    } else if (error.message.includes('auth') || error.message.includes('Auth')) {
      errorType = ErrorType.AUTHENTICATION;
    } else if (error.message.includes('database') || error.message.includes('Database')) {
      errorType = ErrorType.DATABASE;
    } else if (error.message.includes('AI') || error.message.includes('OpenAI')) {
      errorType = ErrorType.AI_SERVICE;
    } else if (error.message.includes('rate limit') || error.message.includes('RateLimit')) {
      errorType = ErrorType.RATE_LIMIT;
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorType = ErrorType.NETWORK;
    }

    appError = createError(errorType, error.message, undefined, undefined, userId, sessionId);
  }

  // Логируем ошибку
  logger.error(appError.message, appError, appError.context, appError.userId, appError.sessionId);

  return appError;
}

// Функция для проверки типа ошибки
export function isAppError(error: any): error is AppError {
  return error && typeof error === 'object' && 'type' in error && 'severity' in error;
}

// Функция для получения HTTP статус кода
export function getHttpStatusCode(error: AppError): number {
  switch (error.type) {
    case ErrorType.VALIDATION:
      return 400;
    case ErrorType.AUTHENTICATION:
      return 401;
    case ErrorType.AUTHORIZATION:
      return 403;
    case ErrorType.RATE_LIMIT:
      return 429;
    case ErrorType.DATABASE:
    case ErrorType.AI_SERVICE:
    case ErrorType.EXTERNAL_SERVICE:
      return 500;
    case ErrorType.INTERNAL:
      return 500;
    default:
      return 500;
  }
}

// Функция для форматирования ошибки для клиента
export function formatErrorForClient(error: AppError): {
  message: string;
  code?: string;
  type: string;
  retryable: boolean;
} {
  return {
    message: error.message,
    code: error.code,
    type: error.type,
    retryable: error.retryable || false
  };
}

// Middleware для обработки ошибок в Express/Next.js
export function errorHandler(error: Error, req: any, res: any, next: any) {
  const appError = handleError(error, req.user?.id, req.session?.id);
  const statusCode = getHttpStatusCode(appError);
  const clientError = formatErrorForClient(appError);

  res.status(statusCode).json({
    error: clientError,
    timestamp: appError.timestamp
  });
}

// Функция для повторных попыток
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Проверяем, можно ли повторить
      if (isAppError(lastError) && !lastError.retryable) {
        throw lastError;
      }

      // Ждем перед следующей попыткой
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
} 
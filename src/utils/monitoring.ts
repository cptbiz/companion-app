// 🚀 Monitoring utility для Companion App
// Мониторинг производительности, метрик и здоровья приложения

import logger from './logger';

export interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  tags?: Record<string, string>;
}

export interface PerformanceMetric {
  operation: string;
  duration: number;
  success: boolean;
  error?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: string;
  error?: string;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  timestamp: string;
}

class Monitoring {
  private metrics: Metric[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private healthChecks: Map<string, HealthCheck> = new Map();
  private maxMetricsHistory = 1000;

  // Метрики производительности
  async measurePerformance<T>(
    operation: string,
    fn: () => Promise<T>,
    userId?: string,
    sessionId?: string
  ): Promise<T> {
    const startTime = Date.now();
    let success = true;
    let error: string | undefined;

    try {
      const result = await fn();
      return result;
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      const duration = Date.now() - startTime;
      this.recordPerformanceMetric(operation, duration, success, error, userId, sessionId);
    }
  }

  private recordPerformanceMetric(
    operation: string,
    duration: number,
    success: boolean,
    error?: string,
    userId?: string,
    sessionId?: string
  ) {
    const metric: PerformanceMetric = {
      operation,
      duration,
      success,
      error,
      timestamp: new Date().toISOString(),
      userId,
      sessionId
    };

    this.performanceMetrics.push(metric);

    // Ограничиваем историю
    if (this.performanceMetrics.length > this.maxMetricsHistory) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetricsHistory);
    }

    // Логируем медленные операции
    if (duration > 1000) {
      logger.warn(`Slow operation: ${operation} took ${duration}ms`, {
        operation,
        duration,
        userId,
        sessionId
      });
    }

    // Логируем ошибки
    if (!success) {
      logger.error(`Operation failed: ${operation}`, new Error(error), {
        operation,
        duration,
        userId,
        sessionId
      });
    }
  }

  // Метрики системы
  recordMetric(name: string, value: number, unit: string, tags?: Record<string, string>) {
    const metric: Metric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      tags
    };

    this.metrics.push(metric);

    // Ограничиваем историю
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }
  }

  // Проверка здоровья сервисов
  async checkServiceHealth(service: string, checkFn: () => Promise<boolean>): Promise<HealthCheck> {
    const startTime = Date.now();
    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    let error: string | undefined;

    try {
      const isHealthy = await checkFn();
      status = isHealthy ? 'healthy' : 'unhealthy';
    } catch (err) {
      status = 'unhealthy';
      error = err instanceof Error ? err.message : 'Unknown error';
    }

    const responseTime = Date.now() - startTime;
    const healthCheck: HealthCheck = {
      service,
      status,
      responseTime,
      lastCheck: new Date().toISOString(),
      error
    };

    this.healthChecks.set(service, healthCheck);

    // Логируем проблемы со здоровьем
    if (status !== 'healthy') {
      logger.warn(`Service health check failed: ${service}`, {
        service,
        status,
        responseTime,
        error
      });
    }

    return healthCheck;
  }

  // Получение статистики производительности
  getPerformanceStats(operation?: string, timeRange?: { start: Date; end: Date }) {
    let metrics = this.performanceMetrics;

    // Фильтруем по операции
    if (operation) {
      metrics = metrics.filter(m => m.operation === operation);
    }

    // Фильтруем по времени
    if (timeRange) {
      metrics = metrics.filter(m => {
        const timestamp = new Date(m.timestamp);
        return timestamp >= timeRange.start && timestamp <= timeRange.end;
      });
    }

    if (metrics.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        successRate: 0
      };
    }

    const successful = metrics.filter(m => m.success);
    const total = metrics.length;
    const durations = metrics.map(m => m.duration);

    return {
      count: total,
      avgDuration: durations.reduce((a, b) => a + b, 0) / total,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      successRate: (successful.length / total) * 100
    };
  }

  // Получение метрик системы
  getSystemMetrics(): SystemMetrics {
    // В реальном приложении здесь будет сбор системных метрик
    // Для демонстрации возвращаем заглушки
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: {
        bytesIn: Math.random() * 1000000,
        bytesOut: Math.random() * 1000000
      },
      timestamp: new Date().toISOString()
    };
  }

  // Получение состояния здоровья всех сервисов
  getAllHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values());
  }

  // Получение метрик за период
  getMetrics(name?: string, timeRange?: { start: Date; end: Date }): Metric[] {
    let metrics = this.metrics;

    if (name) {
      metrics = metrics.filter(m => m.name === name);
    }

    if (timeRange) {
      metrics = metrics.filter(m => {
        const timestamp = new Date(m.timestamp);
        return timestamp >= timeRange.start && timestamp <= timeRange.end;
      });
    }

    return metrics;
  }

  // Очистка старых метрик
  cleanupOldMetrics(maxAge: number = 24 * 60 * 60 * 1000) { // 24 часа по умолчанию
    const cutoff = new Date(Date.now() - maxAge);

    this.metrics = this.metrics.filter(m => new Date(m.timestamp) > cutoff);
    this.performanceMetrics = this.performanceMetrics.filter(m => new Date(m.timestamp) > cutoff);
  }

  // Экспорт метрик для внешних систем
  exportMetrics(): {
    metrics: Metric[];
    performance: PerformanceMetric[];
    health: HealthCheck[];
    system: SystemMetrics;
  } {
    return {
      metrics: this.metrics,
      performance: this.performanceMetrics,
      health: this.getAllHealthChecks(),
      system: this.getSystemMetrics()
    };
  }

  // Декоратор для автоматического измерения производительности
  static measure(operation: string) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const method = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const monitoring = new Monitoring();
        return monitoring.measurePerformance(
          operation,
          () => method.apply(this, args),
          args[0]?.userId,
          args[0]?.sessionId
        );
      };
    };
  }
}

// Глобальный экземпляр мониторинга
const monitoring = new Monitoring();

export default monitoring;

// Утилиты для быстрого доступа
export const measurePerformance = monitoring.measurePerformance.bind(monitoring);
export const recordMetric = monitoring.recordMetric.bind(monitoring);
export const checkServiceHealth = monitoring.checkServiceHealth.bind(monitoring);
export const getPerformanceStats = monitoring.getPerformanceStats.bind(monitoring);
export const getSystemMetrics = monitoring.getSystemMetrics.bind(monitoring);
export const getAllHealthChecks = monitoring.getAllHealthChecks.bind(monitoring);
export const getMetrics = monitoring.getMetrics.bind(monitoring);
export const cleanupOldMetrics = monitoring.cleanupOldMetrics.bind(monitoring);
export const exportMetrics = monitoring.exportMetrics.bind(monitoring); 
#!/bin/bash

# 🧹 Скрипт очистки проекта от проблемных файлов

echo "🧹 Очистка проекта..."

# Удаляем проблемные файлы утилит
rm -rf src/utils/

# Удаляем другие проблемные файлы если есть
rm -f src/utils/logger.ts
rm -f src/utils/errorHandler.ts
rm -f src/utils/monitoring.ts
rm -f src/utils/index.ts
rm -f src/utils/README.md

# Удаляем лишние файлы конфигурации
rm -f DEPLOYMENT.md
rm -f QUICK_START.md
rm -f deploy.sh
rm -f env.example
rm -f vercel.json

# Оставляем только необходимые файлы
echo "✅ Очистка завершена"
echo "📁 Оставшиеся файлы:"
ls -la

echo ""
echo "🚀 Теперь можно отправлять в Git:"
echo "git add ."
echo "git commit -m '🧹 Очистка проекта'"
echo "git push origin main" 
#!/bin/bash

# 🚀 Скрипт автоматического развертывания Companion App
# Railway (Backend) + Vercel (Frontend)

echo "🚀 Начинаем развертывание Companion App..."

# Проверяем наличие необходимых инструментов
check_dependencies() {
    echo "📋 Проверяем зависимости..."
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git не установлен"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js не установлен"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm не установлен"
        exit 1
    fi
    
    echo "✅ Все зависимости установлены"
}

# Устанавливаем зависимости
install_dependencies() {
    echo "📦 Устанавливаем зависимости..."
    npm install
    echo "✅ Зависимости установлены"
}

# Строим проект
build_project() {
    echo "🔨 Строим проект..."
    npm run build
    echo "✅ Проект собран"
}

# Проверяем переменные окружения
check_env() {
    echo "🔍 Проверяем переменные окружения..."
    
    if [ -z "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ]; then
        echo "⚠️  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY не установлен"
    fi
    
    if [ -z "$CLERK_SECRET_KEY" ]; then
        echo "⚠️  CLERK_SECRET_KEY не установлен"
    fi
    
    if [ -z "$OPENAI_API_KEY" ]; then
        echo "⚠️  OPENAI_API_KEY не установлен"
    fi
    
    echo "✅ Проверка завершена"
}

# Развертывание на Railway
deploy_railway() {
    echo "🚂 Развертываем на Railway..."
    
    if ! command -v railway &> /dev/null; then
        echo "📦 Устанавливаем Railway CLI..."
        npm install -g @railway/cli
    fi
    
    echo "🔐 Войдите в Railway..."
    railway login
    
    echo "🚀 Развертываем..."
    railway up
    
    echo "✅ Развертывание на Railway завершено"
}

# Развертывание на Vercel
deploy_vercel() {
    echo "🌐 Развертываем на Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        echo "📦 Устанавливаем Vercel CLI..."
        npm install -g vercel
    fi
    
    echo "🔐 Войдите в Vercel..."
    vercel login
    
    echo "🚀 Развертываем..."
    vercel --prod
    
    echo "✅ Развертывание на Vercel завершено"
}

# Основная функция
main() {
    echo "🎯 Companion App - Автоматическое развертывание"
    echo "================================================"
    
    check_dependencies
    install_dependencies
    build_project
    check_env
    
    echo ""
    echo "🎯 Выберите платформу для развертывания:"
    echo "1) Railway (Backend)"
    echo "2) Vercel (Frontend)"
    echo "3) Оба"
    echo "4) Выход"
    
    read -p "Введите номер (1-4): " choice
    
    case $choice in
        1)
            deploy_railway
            ;;
        2)
            deploy_vercel
            ;;
        3)
            deploy_railway
            deploy_vercel
            ;;
        4)
            echo "👋 До свидания!"
            exit 0
            ;;
        *)
            echo "❌ Неверный выбор"
            exit 1
            ;;
    esac
    
    echo ""
    echo "🎉 Развертывание завершено!"
    echo "📖 Подробности в файле DEPLOYMENT.md"
}

# Запускаем основную функцию
main 
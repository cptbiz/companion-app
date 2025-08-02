#!/usr/bin/env node

// 🗄️ Скрипт настройки PostgreSQL базы данных для Companion App
// Выполняет миграции и настраивает pgvector

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🗄️ Настройка PostgreSQL базы данных...');

  // Получаем DATABASE_URL из переменных окружения
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL не найден в переменных окружения');
    console.log('💡 Убедитесь что PostgreSQL сервис добавлен в Railway');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Подключаемся к базе данных
    console.log('🔌 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключение успешно');

    // Читаем SQL файл с миграциями
    const sqlPath = path.join(__dirname, '..', 'pgvector.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Выполняем миграции
    console.log('📝 Выполнение миграций...');
    await client.query(sqlContent);
    console.log('✅ Миграции выполнены успешно');

    // Проверяем что pgvector установлен
    console.log('🔍 Проверка pgvector...');
    const pgvectorCheck = await client.query(`
      SELECT * FROM pg_extension WHERE extname = 'vector';
    `);

    if (pgvectorCheck.rows.length > 0) {
      console.log('✅ pgvector установлен');
    } else {
      console.log('⚠️ pgvector не найден, попробуйте установить вручную');
    }

    // Создаем тестовую таблицу для проверки
    console.log('🧪 Создание тестовой таблицы...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_vectors (
        id SERIAL PRIMARY KEY,
        embedding vector(1536),
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Вставляем тестовые данные
    await client.query(`
      INSERT INTO test_vectors (content) 
      VALUES ('Тестовый вектор для проверки pgvector')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Тестовая таблица создана');

    // Проверяем таблицы
    console.log('📊 Список таблиц в базе данных:');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    console.log('\n🎉 База данных настроена успешно!');
    console.log('📋 Следующие шаги:');
    console.log('  1. Убедитесь что DATABASE_URL добавлен в переменные окружения');
    console.log('  2. Перезапустите приложение в Railway');
    console.log('  3. Проверьте логи на наличие ошибок');

  } catch (error) {
    console.error('❌ Ошибка при настройке базы данных:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Проверьте:');
      console.log('  - DATABASE_URL корректный');
      console.log('  - PostgreSQL сервис запущен');
      console.log('  - Сетевые настройки Railway');
    }
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Функция для проверки подключения
async function testConnection() {
  console.log('🧪 Тестирование подключения к базе данных...');
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL не найден');
    return false;
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Подключение успешно:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения:', error.message);
    return false;
  } finally {
    await client.end();
  }
}

// Основная функция
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'setup':
      await setupDatabase();
      break;
    case 'test':
      await testConnection();
      break;
    default:
      console.log('🗄️ PostgreSQL Database Setup для Companion App');
      console.log('');
      console.log('Использование:');
      console.log('  node scripts/setup-database.js setup  - Настройка базы данных');
      console.log('  node scripts/setup-database.js test   - Тест подключения');
      console.log('');
      console.log('Переменные окружения:');
      console.log('  DATABASE_URL - URL подключения к PostgreSQL');
      console.log('');
      console.log('Пример DATABASE_URL:');
      console.log('  postgresql://username:password@host:port/database');
  }
}

// Запускаем если файл выполняется напрямую
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupDatabase, testConnection }; 
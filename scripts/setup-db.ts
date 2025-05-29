import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// تنظیمات اتصال به دیتابیس اصلی (postgres)
const adminConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
  database: 'postgres',
};

// نام دیتابیس پروژه
const projectDb = process.env.DB_NAME || 'ticketing';

async function databaseExists(client: Pool, dbName: string): Promise<boolean> {
  const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  return (res.rowCount ?? 0) > 0;
}

async function createDatabase() {
  const client = new Pool(adminConfig);
  await client.connect();
  const exists = await databaseExists(client, projectDb);
  if (!exists) {
    await client.query(`CREATE DATABASE "${projectDb}"`);
    console.log(`Database '${projectDb}' created.`);
  } else {
    console.log(`Database '${projectDb}' already exists.`);
  }
  await client.end();
}

async function runSqlFile(dbConfig: any, filePath: string) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const client = new Pool(dbConfig);
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log(`Executed SQL file: ${filePath}`);
}

async function main() {
  await createDatabase();
  const dbConfig = { ...adminConfig, database: projectDb };
  const scriptsDir = path.join(__dirname);
  const sqlFiles = ['init-db.sql', 'create-admin.sql'];
  for (const file of sqlFiles) {
    const filePath = path.join(scriptsDir, file);
    if (fs.existsSync(filePath)) {
      await runSqlFile(dbConfig, filePath);
    }
  }
  // ایجاد فایل لاگ برای جلوگیری از اجرای مجدد
  fs.writeFileSync(path.join(scriptsDir, '.db-initialized'), new Date().toISOString());
  console.log('Database setup completed.');
}

main().catch((err) => {
  console.error('Error during database setup:', err);
  process.exit(1);
});

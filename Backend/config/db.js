// config/db.js
import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;

dotenv.config();

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
    };

export const pool = new Pool(poolConfig);

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log('✅ PostgreSQL connected');
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
  }
};

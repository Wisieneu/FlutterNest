import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const initializeDatabaseConnection = async () => {
  let db;
  try {
    db = new PrismaClient();
    console.log(`✅ PostgreSQL database connection has been established successfully.`);
  } catch (err) {
    console.log(`❌ Could not connect to the PostgreSQL database: ${err}`);
  }
  return db;
};

export default initializeDatabaseConnection;

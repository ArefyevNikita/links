import { DataSource } from 'typeorm';
import { validateEnv } from '../../config/env';
import { LinkOrmEntity } from './entities/LinkOrmEntity';

const env = validateEnv();

const isTest = env.NODE_ENV === 'test';
const databaseUrl = isTest ? env.TEST_DATABASE_URL : env.DATABASE_URL;

if (!databaseUrl) {
  const dbName = isTest ? env.TEST_DATABASE_NAME : env.DATABASE_NAME;
  const connectionString = `postgresql://${env.DATABASE_USERNAME}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${dbName}`;
  
  console.log(`Using constructed database URL: ${connectionString}`);
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl || `postgresql://${env.DATABASE_USERNAME}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${isTest ? env.TEST_DATABASE_NAME : env.DATABASE_NAME}`,
  entities: [LinkOrmEntity],
  migrations: [`${__dirname  }/migrations/*.{ts,js}`],
  synchronize: false,
  logging: env.NODE_ENV === 'development',
  ssl: false,
});

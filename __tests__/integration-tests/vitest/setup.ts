/* eslint-disable import/no-extraneous-dependencies */

import { debug } from 'debug';

import { getPool } from '@backend-api/admin-db/db';

import { createDatabases, runMigrations } from './utils/database';
import { startPostgresContainer } from './utils/docker';

const logger = debug('setup');

export async function setup() {
  logger('Starting PostgreSQL server...');
  const container = await startPostgresContainer();
  const connection = container.getConnectionUri();
  logger(`Started PostgreSQL server at "${connection}"!`);

  const [adminDb] = await createDatabases(connection);

  process.env.ADMIN_DB_HOST = container.getHost();
  process.env.ADMIN_DB_PORT = container.getPort().toString();
  process.env.ADMIN_DB_USERNAME = container.getUsername();
  process.env.ADMIN_DB_PASSWORD = container.getPassword();
  process.env.ADMIN_DB_NAME = adminDb;

  process.env.DISABLE_CACHE = 'true';
  process.env.LOG_LEVEL = 'error';

  process.env.FASTIFY_SESSION_SECRET = 'RANDOM_STRING_WITH_AT_LEAST_32_CHARS';

  process.env.IMAGE_BUCKET_NAME = 'hashdash-tests';

  process.env.RECOMMENDATIONS_API_BASE_URL = 'http://recommendations-api/';
  process.env.RECOMMENDATIONS_API_AUTH = 'recommendations-api-auth';

  logger('Migrating database...');
  logger('Migrated database', await runMigrations());
}

export async function teardown() {
  await getPool().end();
}

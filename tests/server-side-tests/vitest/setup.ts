/* eslint-disable import/no-extraneous-dependencies */

import { debug } from 'debug';

import { getPool } from '@coyle/database';

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

  logger('Migrating database...');
  logger('Migrated database', await runMigrations());
}

export async function teardown() {
  await getPool().end();
}

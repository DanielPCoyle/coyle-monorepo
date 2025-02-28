/* eslint-disable import/no-extraneous-dependencies */

import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export async function startPostgresContainer(): Promise<StartedPostgreSqlContainer> {
  return new PostgreSqlContainer().withReuse().start();
}

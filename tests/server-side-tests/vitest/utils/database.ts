import { exec } from 'child_process';

import { Client } from 'pg';

export async function createDatabases(connectionString: string) {
  const client = new Client({ connectionString });

  const now = Date.now();
  const dbs = [`admin-db-${now}`];

  await client.connect();
  await Promise.all(dbs.map(db => client.query(`CREATE DATABASE "${db}";`)));
  await client.end();

  return dbs;
}

export async function runMigrations() {
  return new Promise((resolve, reject) => {
    exec(
      'yarn workspace @coyle/database migrate',
      { env: process.env },
      (error, output) => {
      if (error) {
        console.error('Migration error:', error);
        reject(error);
      } else {
        console.log('Migration output:\n', output);
        resolve(output);
      }
      }
    );
  });
}

/* eslint-disable import/no-extraneous-dependencies */

import { debug } from 'debug';

import { getPool } from '@backend-api/admin-db/db';


const logger = debug('setup');

export async function setup() {

}

export async function teardown() {
  await getPool().end();
}

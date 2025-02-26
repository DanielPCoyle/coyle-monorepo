import { beforeEach, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /conditions/:id', () => {
  const db = getAdminDb();

  beforeEach(async () => {
    await getAdminDbSeeder(db).withConditions([
      { id: 1, key: '__KEY_1__', name: '__NAME_1__' },
    ]);
  });

  const request = getGETRequester({
    path: '/conditions/1',
    defaultHeaders: { authorization: '' },
  });

  it('gets condition', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      id: 1,
      key: '__KEY_1__',
      name: '__NAME_1__',
    });
  });

  it('fails if condition does not exists', async () => {
    const response = await request({ path: '/conditions/2' });

    expect(response.statusCode).toEqual(404);
  });

  testAuthorizationErrors(request);
});

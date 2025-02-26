import { beforeEach, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /terpenes/:id', () => {
  const db = getAdminDb();

  beforeEach(async () => {
    await getAdminDbSeeder(db).withTerpenes([
      { id: 1, key: '__KEY_1__', name: '__NAME_1__' },
    ]);
  });

  const request = getGETRequester({
    path: '/terpenes/1',
    defaultHeaders: { authorization: '' },
  });

  it('gets terpene', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      id: 1,
      key: '__KEY_1__',
      name: '__NAME_1__',
    });
  });

  it('fails if terpene does not exists', async () => {
    const response = await request({ path: '/terpenes/2' });

    expect(response.statusCode).toEqual(404);
  });

  testAuthorizationErrors(request);
});

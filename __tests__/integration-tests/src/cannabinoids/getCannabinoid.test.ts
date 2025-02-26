import { beforeEach, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /cannabinoids/:id', () => {
  const db = getAdminDb();

  beforeEach(async () => {
    await getAdminDbSeeder(db).withCannabinoids([
      { id: 1, key: '__KEY_1__', name: '__NAME_1__' },
    ]);
  });

  const request = getGETRequester({
    path: '/cannabinoids/1',
    defaultHeaders: { authorization: '' },
  });

  it('gets cannabinoid', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      id: 1,
      key: '__KEY_1__',
      name: '__NAME_1__',
    });
  });

  it('fails if cannabinoid does not exists', async () => {
    const response = await request({ path: '/cannabinoids/2' });

    expect(response.statusCode).toEqual(404);
  });

  testAuthorizationErrors(request);
});

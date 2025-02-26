import { beforeEach, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /effects/:id', () => {
  const db = getAdminDb();

  beforeEach(async () => {
    await getAdminDbSeeder(db).withEffects([
      { id: 1, key: '__KEY_1__', name: '__NAME_1__' },
    ]);
  });

  const request = getGETRequester({
    path: '/effects/1',
    defaultHeaders: { authorization: '' },
  });

  it('gets effect', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      id: 1,
      key: '__KEY_1__',
      name: '__NAME_1__',
    });
  });

  it('fails if effect does not exists', async () => {
    const response = await request({ path: '/effects/2' });

    expect(response.statusCode).toEqual(404);
  });

  testAuthorizationErrors(request);
});

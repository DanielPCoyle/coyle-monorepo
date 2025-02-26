import { beforeEach, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /flavors/:id', () => {
  const db = getAdminDb();

  beforeEach(async () => {
    await getAdminDbSeeder(db).withFlavors([
      { id: 1, key: '__KEY_1__', name: '__NAME_1__' },
    ]);
  });

  const request = getGETRequester({
    path: '/flavors/1',
    defaultHeaders: { authorization: '' },
  });

  it('gets flavor', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      id: 1,
      key: '__KEY_1__',
      name: '__NAME_1__',
    });
  });

  it('fails if flavor does not exists', async () => {
    const response = await request({ path: '/flavors/2' });

    expect(response.statusCode).toEqual(404);
  });

  testAuthorizationErrors(request);
});

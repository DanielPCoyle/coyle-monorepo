import { beforeEach, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getPATCHRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('PATCH /flavors/:id', () => {
  const db = getAdminDb();

  beforeEach(async () => {
    await getAdminDbSeeder(db).withFlavors([
      { id: 1, key: '__KEY_1__', name: '__NAME_1__' },
      { id: 2, key: '__KEY_2__', name: '__NAME_2__' },
    ]);
  });

  const validBody: Record<string, unknown> = {
    name: '__UPDATED_NAME__',
  };

  const request = getPATCHRequester({
    path: '/flavors/1',
    defaultBody: validBody,
    defaultHeaders: { authorization: '' },
  });

  it('updates flavor', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      id: 1,
      key: '__KEY_1__',
      name: '__UPDATED_NAME__',
    });
  });

  it('fails if flavor does not exists', async () => {
    const response = await request({ path: '/flavors/3' });

    expect(response.statusCode).toEqual(404);
  });

  testAuthorizationErrors(request);
});

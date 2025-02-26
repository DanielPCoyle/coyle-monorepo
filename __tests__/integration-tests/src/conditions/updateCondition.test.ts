import { beforeEach, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getPATCHRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('PATCH /conditions/:id', () => {
  const db = getAdminDb();

  beforeEach(async () => {
    await getAdminDbSeeder(db).withConditions([
      { id: 1, key: '__KEY_1__', name: '__NAME_1__' },
      { id: 2, key: '__KEY_2__', name: '__NAME_2__' },
    ]);
  });

  const validBody: Record<string, unknown> = {
    name: '__UPDATED_NAME__',
  };

  const request = getPATCHRequester({
    path: '/conditions/1',
    defaultBody: validBody,
    defaultHeaders: { authorization: '' },
  });

  it('updates condition', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      id: 1,
      key: '__KEY_1__',
      name: '__UPDATED_NAME__',
    });
  });

  it('fails if condition does not exists', async () => {
    const response = await request({ path: '/conditions/3' });

    expect(response.statusCode).toEqual(404);
  });

  testAuthorizationErrors(request);
});

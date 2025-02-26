import { beforeEach, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /symptoms', () => {
  const db = getAdminDb();

  beforeEach(async () => {
    await getAdminDbSeeder(db).withSymptoms([
      { id: 1, key: '__KEY_1__', name: '__NAME_1__' },
      { id: 2, key: '__KEY_2__', name: '__NAME_2__' },
    ]);
  });

  const request = getGETRequester({
    path: '/symptoms',
    defaultHeaders: { authorization: '' },
  });

  it('gets symptoms', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual([
      { id: 1, key: '__KEY_1__', name: '__NAME_1__' },
      { id: 2, key: '__KEY_2__', name: '__NAME_2__' },
    ]);
  });

  testAuthorizationErrors(request);
});

import { describe, beforeEach, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /ui/image-groups/', () => {
  const db = getAdminDb();

  const request = getGETRequester({
    path: '/ui/image-groups',
    defaultHeaders: {
      authorization: '',
    },
  });

  beforeEach(async () => {
    await getAdminDbSeeder(db).withImageGroups([
      { id: 1, slug: 'ads', label: 'Ads' },
      { id: 2, slug: 'test', label: 'Test' },
    ]);
  });

  it('gets image groups', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual([
      { id: 2, parentId: null, slug: 'test', label: 'Test' },
      { id: 1, parentId: null, slug: 'ads', label: 'Ads' },
    ]);
  });

  testAuthorizationErrors(request);
});

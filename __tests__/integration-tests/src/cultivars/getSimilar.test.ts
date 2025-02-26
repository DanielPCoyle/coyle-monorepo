import { beforeAll, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /cultivars/:cultivarId/similar', () => {
  const adminDb = getAdminDb();

  const request = getGETRequester({
    path: '/cultivars/1/similar',
    defaultHeaders: { authorization: '' },
  });

  beforeAll(async () => {
    await getAdminDbSeeder(adminDb)
      .withEffects([
        { id: 1, key: 'relaxed', name: '' },
        { id: 2, key: 'focused', name: '' },
        { id: 3, key: 'creative', name: '' },
      ])
      .withCultivarEffects([
        { cultivarId: 1, effectId: 1, value: 10, recommendation: 'r4' },
        { cultivarId: 1, effectId: 2, value: 20, recommendation: 'r4' },
        { cultivarId: 1, effectId: 3, value: 30, recommendation: 'r4' },
        { cultivarId: 2, effectId: 1, value: 20, recommendation: 'r2' },
        { cultivarId: 2, effectId: 2, value: 20, recommendation: 'r2' },
        { cultivarId: 2, effectId: 3, value: 21, recommendation: 'r2' },
        { cultivarId: 3, effectId: 1, value: 20, recommendation: 'r4' },
        { cultivarId: 3, effectId: 2, value: 10, recommendation: 'r4' },
        { cultivarId: 3, effectId: 3, value: 10, recommendation: 'r4' },
        { cultivarId: 4, effectId: 1, value: 50, recommendation: 'r4' },
        { cultivarId: 4, effectId: 2, value: 10, recommendation: 'r4' },
        { cultivarId: 4, effectId: 3, value: 10, recommendation: 'r4' },
      ]);
  });

  it('loads similar for cultivar 1', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      ids: [2],
    });
  });

  it('loads similar for cultivar 2', async () => {
    const response = await request({ path: '/cultivars/2/similar' });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      ids: [1],
    });
  });

  it('loads similar for cultivar 3', async () => {
    const response = await request({ path: '/cultivars/3/similar' });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      ids: [4],
    });
  });

  it('loads similar for cultivar 4', async () => {
    const response = await request({ path: '/cultivars/4/similar' });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      ids: [3],
    });
  });

  testAuthorizationErrors(request);
});

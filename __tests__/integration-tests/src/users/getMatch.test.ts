import nock from 'nock';
import { describe, beforeAll, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';

import {
  matches,
  prepareAdminDbDataSet,
} from '../__fixtures__/recommendations';
import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /users/:userId/match/:cultivarId', () => {
  const scope = nock(process.env.RECOMMENDATIONS_API_BASE_URL!);

  const adminDb = getAdminDb();

  const userId = 21;

  const request = getGETRequester({
    path: `/users/${userId}/match/1`,
    defaultHeaders: { authorization: '' },
  });

  beforeAll(async () => {
    await prepareAdminDbDataSet(adminDb, userId);
  });

  it.each(matches)('calculates matches for ID $id', async item => {
    scope.get(`/stashes/1/cultivars/${item.id}/match`).reply(200, {
      hasStashData: true,
      match: item.match,
    });

    const response = await request({
      path: `/users/${userId}/match/${item.id}`,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      hasStashData: true,
      match: item.match,
    });

    expect(scope.isDone()).toBe(true);
  });

  testAuthorizationErrors(request);
});

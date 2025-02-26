import nock from 'nock';
import { describe, beforeAll, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';

import {
  matches,
  prepareAdminDbDataSet,
} from '../__fixtures__/recommendations';
import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /users/:userId/matches', () => {
  const scope = nock(process.env.RECOMMENDATIONS_API_BASE_URL!);

  const adminDb = getAdminDb();

  const userId = 22;

  const request = getGETRequester({
    path: `/users/${userId}/matches`,
    defaultHeaders: { authorization: '' },
  });

  beforeAll(async () => {
    await prepareAdminDbDataSet(adminDb, userId);
  });

  it('calculates matches', async () => {
    scope.get('/stashes/1/matches').reply(200, {
      hasStashData: true,
      matches,
    });

    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      hasStashData: true,
      matches,
    });

    expect(scope.isDone()).toBe(true);
  });

  it('calculates matches for specific cultivars', async () => {
    scope.get(`/stashes/1/matches?c[]=${matches[1].id}`).reply(200, {
      hasStashData: true,
      matches: [matches[1]],
    });

    const response = await request({
      path: `/users/${userId}/matches?c[]=${matches[1].id}`,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      hasStashData: true,
      matches: [matches[1]],
    });

    expect(scope.isDone()).toBe(true);
  });

  testAuthorizationErrors(request);
});

import nock from 'nock';
import { describe, beforeAll, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';

import { prepareAdminDbDataSet } from '../__fixtures__/recommendations';
import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /users/:userId/matches/flavor/:flavor', () => {
  const scope = nock(process.env.RECOMMENDATIONS_API_BASE_URL!);

  const adminDb = getAdminDb();

  const userId = 13;

  const request = getGETRequester({
    path: `/users/${userId}/matches/flavor/apple`,
    defaultHeaders: { authorization: '' },
  });

  beforeAll(async () => {
    await prepareAdminDbDataSet(adminDb, userId);
  });

  // we actually have no flavor matches defined on the data set, so this response should be empty
  it('calculates matches', async () => {
    scope.get('/stashes/1/flavors/1/matches?limit=100').reply(200, {
      hasStashData: true,
      matchesByRecommendationLevel: [],
    });

    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      hasStashData: true,
      matchesByRecommendationLevel: [],
    });

    expect(scope.isDone()).toBe(true);
  });

  testAuthorizationErrors(request);
});

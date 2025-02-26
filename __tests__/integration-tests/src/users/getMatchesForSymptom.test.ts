import nock from 'nock';
import { describe, beforeAll, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';

import {
  matches,
  prepareAdminDbDataSet,
} from '../__fixtures__/recommendations';
import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /users/:userId/matches/symptom/:symptom', () => {
  const scope = nock(process.env.RECOMMENDATIONS_API_BASE_URL!);

  const adminDb = getAdminDb();

  const userId = 14;

  const request = getGETRequester({
    path: `/users/${userId}/matches/symptom/pain`,
    defaultHeaders: { authorization: '' },
  });

  beforeAll(async () => {
    await prepareAdminDbDataSet(adminDb, userId);
  });

  it('calculates matches', async () => {
    scope.get('/stashes/1/symptoms/1/matches?limit=100').reply(200, {
      hasStashData: true,
      matchesByRecommendationLevel: [
        { level: 'r4', matches: [matches[0], matches[1]] },
      ],
    });

    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      hasStashData: true,
      matchesByRecommendationLevel: [
        { level: 'r4', matches: [matches[0], matches[1]] },
      ],
    });

    expect(scope.isDone()).toBe(true);
  });

  it('queries with limit', async () => {
    scope.get('/stashes/1/symptoms/1/matches?limit=1').reply(200, {
      hasStashData: true,
      matchesByRecommendationLevel: [{ level: 'r4', matches: [matches[0]] }],
    });

    const response = await request({
      path: `/users/${userId}/matches/symptom/pain?limit=1`,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      hasStashData: true,
      matchesByRecommendationLevel: [{ level: 'r4', matches: [matches[0]] }],
    });

    expect(scope.isDone()).toBe(true);
  });

  testAuthorizationErrors(request);
});

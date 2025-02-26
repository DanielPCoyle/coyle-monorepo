import nock from 'nock';
import { describe, beforeAll, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';

import { prepareAdminDbDataSet } from '../__fixtures__/recommendations';
import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /users/:userId/match/:cultivarId/info', () => {
  const scope = nock(process.env.RECOMMENDATIONS_API_BASE_URL!);

  const adminDb = getAdminDb();

  const userId = 23;

  const request = getGETRequester({
    path: `/users/${userId}/match/2/info`,
    defaultHeaders: { authorization: '' },
  });

  beforeAll(async () => {
    await prepareAdminDbDataSet(adminDb, userId);
  });

  it('calculates matches for cultivar 2', async () => {
    scope.get('/stashes/1/cultivars/2/match-info').reply(200, {
      match: 0.75,

      maxScore: 48,
      maxScoreThreshold: 46,

      score: 36,

      dataPointCount: 9,

      details: {
        cannabinoids: {
          maxScore: 4,
          score: 4,
          matches: {
            3: 4,
          },
        },

        conditions: {
          maxScore: 4,
          score: 4,
          matches: {
            1: 4,
          },
        },

        effects: {
          maxScore: 24,
          score: 12,
          matches: {
            1: 4,
            2: 4,
            3: 4,
          },
        },

        flavors: {
          maxScore: 0,
          score: 0,
          matches: {},
        },

        negatives: {
          maxScore: 0,
          score: 0,
          matches: {},
        },

        symptoms: {
          maxScore: 32,
          score: 0,
          matches: {},
        },

        terpenes: {
          maxScore: 8,
          score: 0,
          matches: {},
        },

        balance: {
          maxScore: 8,
          score: 8,
          matches: {
            '-1': 8,
          },
        },

        thcLevel: {
          maxScore: 8,
          score: 8,
          matches: {
            1: 8,
          },
        },
      },
    });

    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      match: 0.75,

      maxScore: 48,
      maxScoreThreshold: 46,

      score: 36,

      dataPointCount: 9,

      details: {
        cannabinoids: {
          maxScore: 4,
          score: 4,
          matches: {
            cbg: 4,
          },
        },

        conditions: {
          maxScore: 4,
          score: 4,
          matches: {
            arthritis: 4,
          },
        },

        effects: {
          maxScore: 24,
          score: 12,
          matches: {
            relaxed: 4,
            focused: 4,
            creative: 4,
          },
        },

        flavors: {
          maxScore: 0,
          score: 0,
          matches: {},
        },

        negatives: {
          maxScore: 0,
          score: 0,
          matches: {},
        },

        symptoms: {
          maxScore: 32,
          score: 0,
          matches: {},
        },

        terpenes: {
          maxScore: 8,
          score: 0,
          matches: {},
        },

        balance: {
          maxScore: 8,
          score: 8,
          matches: {
            'CBD Dominant': 8,
          },
        },

        thcLevel: {
          maxScore: 8,
          score: 8,
          matches: {
            Low: 8,
          },
        },
      },
    });

    expect(scope.isDone()).toBe(true);
  });

  testAuthorizationErrors(request);
});

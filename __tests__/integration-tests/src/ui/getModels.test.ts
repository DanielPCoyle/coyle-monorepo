import { describe, expect, it } from 'vitest';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /ui/models', () => {
  const request = getGETRequester({
    path: '/ui/models',
    defaultHeaders: {
      authorization: '',
    },
  });

  it('retrieves configured models', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toMatchObject([
      { type: 'collection', slug: 'ad-ads', name: 'Ads' },
      { type: 'collection', slug: 'ad-campaigns', name: 'Ad Campaigns' },
      { type: 'collection', slug: 'ad-partners', name: 'Ad Partners' },
      { type: 'collection', slug: 'ad-placements', name: 'Ad Placements' },
      { type: 'collection', slug: 'cannabinoids', name: 'Cannabinoids' },
      { type: 'collection', slug: 'conditions', name: 'Conditions' },
      { type: 'collection', slug: 'effects', name: 'Effects' },
      { type: 'collection', slug: 'flavors', name: 'Flavors' },
      { type: 'collection', slug: 'negatives', name: 'Negatives' },
      { type: 'collection', slug: 'symptoms', name: 'Symptoms' },
      { type: 'collection', slug: 'terpenes', name: 'Terpenes' },
    ]);
  });

  testAuthorizationErrors(request);
});

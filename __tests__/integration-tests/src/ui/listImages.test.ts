import { describe, beforeEach, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /ui/image-groups/:slug/images', () => {
  const db = getAdminDb();

  const request = getGETRequester({
    path: '/ui/image-groups/ads/images',
    defaultHeaders: {
      authorization: '',
    },
  });

  beforeEach(async () => {
    process.env.IMAGE_BUCKET_NAME = 'hashdash-tests';

    await getAdminDbSeeder(db)
      .withImageGroups([
        { id: 1, slug: 'ads', label: 'Ads' },
        { id: 2, slug: 'test', label: 'Test' },
      ])
      .withImages([
        {
          imageGroupId: 1,
          slug: 'slug-1',
          extension: 'svg',
          height: 100,
          width: 100,
          size: 123,
          originalName: '100x100.svg',
        },
        {
          imageGroupId: 1,
          slug: 'slug-2',
          extension: 'svg',
          height: 200,
          width: 200,
          size: 456,
          originalName: '200x200.svg',
        },
        {
          imageGroupId: 2,
          slug: 'slug-3',
          extension: 'svg',
          height: 300,
          width: 300,
          size: 789,
          originalName: '300x300.svg',
        },
      ]);
  });

  it('gets images', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual([
      {
        id: 2,
        slug: 'slug-2',
        extension: 'svg',
        height: 200,
        width: 200,
        size: 456,
        originalName: '200x200.svg',
        url: 'https://storage.googleapis.com/hashdash-tests/o/slug-2.svg',
      },
      {
        id: 1,
        slug: 'slug-1',
        extension: 'svg',
        height: 100,
        width: 100,
        size: 123,
        originalName: '100x100.svg',
        url: 'https://storage.googleapis.com/hashdash-tests/o/slug-1.svg',
      },
    ]);
  });

  it('fails if group does not exists', async () => {
    const response = await request({
      path: `/ui/image-groups/__INVALID__/images`,
    });

    expect(response.statusCode).toEqual(404);
  });

  testAuthorizationErrors(request);
});

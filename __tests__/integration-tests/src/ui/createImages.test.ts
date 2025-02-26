import { readFileSync } from 'fs';
import { join } from 'path';

import axios from 'axios';
import FormData from 'form-data';
import { describe, beforeEach, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getPUTRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('PUT /ui/image-groups/:slug/images', () => {
  const db = getAdminDb();

  const imagePath = join(__dirname, '..', '__fixtures__', '100x100.svg');

  const request = getPUTRequester<FormData>({
    path: '/ui/image-groups/ads/images',
    defaultBody: () => {
      const formData = new FormData();

      formData.append('file', readFileSync(imagePath), '100x100.svg');

      return formData;
    },
    defaultHeaders: body => ({
      ...body.getHeaders(),
      authorization: '',
    }),
  });

  beforeEach(async () => {
    process.env.IMAGE_BUCKET_NAME = 'hashdash-tests';

    await getAdminDbSeeder(db).withImages([]);
  });

  it('uploads image successfully', async () => {
    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      succeeded: ['100x100.svg'],
      failed: [],
    });

    const images = await db.query.image.findMany();
    expect(images).toHaveLength(1);

    const image = images[0];
    expect(image).toMatchObject({
      id: 1,
      imageGroupId: 1,
      slug: expect.any(String),
      extension: 'svg',
      height: 100,
      width: 100,
      size: 2483,
      originalName: '100x100.svg',
    });

    await expect(
      axios.get(
        `https://storage.googleapis.com/hashdash-tests/o/${image.slug}.svg`
      )
    ).resolves.toMatchObject({
      status: 200,
    });
  });

  it('fails when uploading non-image file', async () => {
    const formData = new FormData();

    formData.append('file', readFileSync(__filename), 'createImages.test.ts');

    const response = await request({ body: formData });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      succeeded: [],
      failed: ['createImages.test.ts'],
    });
  }, 20000);

  testAuthorizationErrors(request);
});

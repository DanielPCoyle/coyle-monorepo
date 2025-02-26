import { readFileSync } from 'fs';
import { join } from 'path';

import FormData from 'form-data';
import { describe, beforeEach, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';
import { server } from '@backend-api/http-server';

import { getGETRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('GET /ui/images/:id', () => {
  const db = getAdminDb();

  const imagePath = join(__dirname, '..', '__fixtures__', '100x100.svg');

  const request = getGETRequester({
    path: '/ui/images',
    defaultHeaders: {
      authorization: '',
    },
  });

  beforeEach(async () => {
    process.env.IMAGE_BUCKET_NAME = 'hashdash-tests';

    await getAdminDbSeeder(db).withImages([]);
  });

  it('retrieves image successfully', async () => {
    const formData = new FormData();
    formData.append('file', readFileSync(imagePath), '100x100.svg');

    await server
      .inject()
      .put('/ui/image-groups/ads/images')
      .body(formData)
      .headers({
        ...formData.getHeaders(),
        authorization: '',
      });

    const image = await db.query.image.findFirst();
    expect(image).not.toBeNull();

    const response = await request({ path: `/ui/images/${image!.id}` });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      id: 1,
      slug: image!.slug,
      extension: 'svg',
      height: 100,
      width: 100,
      size: 2483,
      originalName: '100x100.svg',
      url: `https://storage.googleapis.com/hashdash-tests/o/${image!.slug}.svg`,
    });
  });

  it('fails if image does not exists', async () => {
    const response = await request({ path: `/ui/images/1234567890` });

    expect(response.statusCode).toEqual(404);
  });

  testAuthorizationErrors(request);
});

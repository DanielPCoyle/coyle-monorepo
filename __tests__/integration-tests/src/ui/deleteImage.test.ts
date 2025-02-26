import { readFileSync } from 'fs';
import { join } from 'path';

import axios from 'axios';
import FormData from 'form-data';
import { describe, beforeEach, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';
import { server } from '@backend-api/http-server';

import { getDELETERequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('DELETE /ui/images/:id', () => {
  const db = getAdminDb();

  const imagePath = join(__dirname, '..', '__fixtures__', '100x100.svg');

  const request = getDELETERequester({
    path: '/ui/images',
    defaultHeaders: {
      authorization: '',
    },
  });

  beforeEach(async () => {
    process.env.IMAGE_BUCKET_NAME = 'hashdash-tests';

    await getAdminDbSeeder(db).withImages([]);
  });

  it('deletes image successfully', async () => {
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
    expect(response.json()).toEqual({ ok: true });

    const images = await db.query.image.findMany();
    expect(images).toHaveLength(0);

    await expect(
      axios.get(
        `https://storage.googleapis.com/hashdash-tests/o/${image!.slug}.svg`
      )
    ).rejects.toThrow('Request failed with status code 404');
  });

  it('fails if image does not exists', async () => {
    const response = await request({ path: `/ui/images/1234567890` });

    expect(response.statusCode).toEqual(404);
  });

  testAuthorizationErrors(request);
});

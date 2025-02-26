import { beforeEach, describe, expect, it } from 'vitest';
import type { ZodSchema } from 'zod';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getPATCHRequester, getPOSTRequester } from '../getRequester';
import { testAuthorizationErrors } from '../testAuthorizationErrors';

const authCode: string = process.env.AUTH_TOKEN || '';

export const updateRecordEndpointTest = ({
  endpoint,
  testData,
  updateData,
  withFunc,
  model,
  cleanUp,
}: {
  endpoint: string;
  testData: any;
  updateData: any;
  model: string;
  withFunc: string;
  schema?: ZodSchema;
  cleanUp?: (record: any) => any;
}) => {
  return describe(`PATCH /${endpoint}/:id`, () => {
    const db = getAdminDb();
    const id: number = 1;

    beforeEach(async () => {
      const adminDB: any = getAdminDbSeeder(db);
      await adminDB[withFunc](testData);
    });

    const request = getPATCHRequester({
      path: `/${endpoint}/${id}`,
      defaultBody: updateData,
      defaultHeaders: { authorization: authCode },
    });

    it(`updates ${model}`, async () => {
      const validBody: Record<string, unknown> = testData;
      const postRequest = getPOSTRequester({
        path: `/${endpoint}`,
        defaultBody: validBody,
        defaultHeaders: { authorization: authCode },
      });

      await postRequest();

      const response = await request();
      expect(response.statusCode).toEqual(200);

      let result = response.json();
      if (cleanUp) {
        result = cleanUp(result);
      }
      expect(result).toEqual(JSON.parse(JSON.stringify(updateData)));
    });

    it(`fails if ${model} does not exist`, async () => {
      const response = await request({ path: `/${endpoint}/999` });
      expect(response.statusCode).toEqual(404);
    });

    testAuthorizationErrors(request);
  });
};

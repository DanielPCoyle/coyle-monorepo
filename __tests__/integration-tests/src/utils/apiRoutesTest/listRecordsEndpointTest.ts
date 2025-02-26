import { beforeEach, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../getRequester';
import { testAuthorizationErrors } from '../testAuthorizationErrors';

const authCode: string = process.env.AUTH_TOKEN || '';

export const listRecordsEndpointTest = ({
  endpoint,
  withFunctionName,
  testData,
  fieldsToTest,
  orderBy,
}: {
  endpoint: string;
  withFunctionName: keyof ReturnType<typeof getAdminDbSeeder>;
  testData: any;
  fieldsToTest: string[];
  orderBy: string;
}) => {
  return describe(`GET LIST /${endpoint}`, () => {
    const db = getAdminDb();

    beforeEach(async () => {
      const adminDb = getAdminDbSeeder(db);
      await adminDb[withFunctionName](testData);
    });

    let request = getGETRequester({
      path: `/${endpoint}`,
      defaultHeaders: { authorization: authCode },
    });

    it(`gets list ${endpoint}`, async () => {
      const response = await request();
      expect(response.statusCode).toEqual(200);
      expect(response.json()).toEqual(JSON.parse(JSON.stringify(testData)));
    });

    it('applies select query parameters', async () => {
      request = getGETRequester({
        path: `/${endpoint}?fields=${fieldsToTest.join(',')}`,
        defaultHeaders: { authorization: authCode },
      });

      const response = await request();
      expect(response.statusCode).toEqual(200);
      const testDataCheck = testData.map((data: any) => {
        const obj: any = {};
        fieldsToTest.forEach((field: string) => {
          obj[field] = data[field];
        });
        return obj;
      });
      expect(response.json()).toEqual(testDataCheck);
    });

    it('applies order by query parameters', async () => {
      request = getGETRequester({
        path: `/${endpoint}?orderby=${orderBy}&order=desc&limit=2&fields=id`,
        defaultHeaders: { authorization: authCode },
      });

      const response = await request();
      expect(response.statusCode).toEqual(200);
      expect(response.json()).toEqual([
        {
          id: 2,
        },
        {
          id: 1,
        },
      ]);
    });

    it('applies pagination query parameters', async () => {
      request = getGETRequester({
        path: `/${endpoint}?page=2&limit=1&fields=id`,
        defaultHeaders: { authorization: authCode },
      });

      const response = await request();
      expect(response.statusCode).toEqual(200);
      expect(response.json()).toEqual([
        {
          id: 2,
        },
      ]);
    });

    testAuthorizationErrors(request);
  });
};

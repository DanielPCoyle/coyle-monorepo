import { beforeEach, describe, expect, it } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getGETRequester } from '../getRequester';
import { testAuthorizationErrors } from '../testAuthorizationErrors';

const authCode: string = process.env.AUTH_TOKEN || '';

/**
 * Tests the GET single record endpoint for a given model.
 *
 * @param {Object} params - The parameters for the test.
 * @param {string} params.endpoint - The endpoint to test.
 * @param {string} params.model - The name of the model being tested.
 * @param {string} params.plural - The plural form of the model name.
 * @param {any} params.testData - The test data to seed the database with.
 *
 * @example
 * getSingleRecordEndpointTest({
 *   endpoint: 'users',
 *   model: 'User',
 *   plural: 'users',
 *   testData: [{ id: 1, name: 'John Doe' }]
 * });
 */
export const getSingleRecordEndpointTest = ({
  endpoint,
  model,
  withFunctionName,
  testData,
}: {
  endpoint: string;
  model: string;
  withFunctionName: keyof ReturnType<typeof getAdminDbSeeder>;
  testData: any;
}) => {
  describe(`GET SINGLE /${endpoint}/:id`, () => {
    const db = getAdminDb();

    beforeEach(async () => {
      const adminDbSeeder: any = getAdminDbSeeder(db);
      const withFunc = withFunctionName;
      await adminDbSeeder[withFunc](testData);
    });

    const request = getGETRequester({
      path: `/${endpoint}/1`,
      defaultHeaders: { authorization: authCode },
    });

    it(`gets ${model}`, async () => {
      const response = await request();

      const results = response.json();
      expect(response.statusCode).toEqual(200);
      expect(results).toEqual(JSON.parse(JSON.stringify(testData[0])));
    });

    it(`fails if ${model} does not exist`, async () => {
      const response = await request({ path: `/${endpoint}/9999` });
      expect(response.statusCode).toEqual(404);
    });

    testAuthorizationErrors(request);
  });
};

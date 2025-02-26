import { describe, expect, it } from 'vitest';

import * as db from '@backend-api/admin-db/schema';
import { sanitizeRecord } from '@backend-api/http-server/src/utils/shared/apiRoutes/utils/sanitizeRecord';

import { getPOSTRequester } from '../getRequester';
import { testAuthorizationErrors } from '../testAuthorizationErrors';

export const createRecordEndpointTest = ({
  endpoint,
  testData,
  model,
  cleanUp,
  requiredFiled,
}: {
  endpoint: string;
  testData: any;
  model: keyof typeof db;
  cleanUp?: (record: any) => any;
  requiredFiled: string;
}) => {
  return describe(`POST /${endpoint}`, () => {
    const authCode: string = process.env.AUTH_TOKEN || '';

    const validBody: Record<string, unknown> = testData;

    const request = getPOSTRequester({
      path: `/${endpoint}`,
      defaultBody: validBody,
      defaultHeaders: { authorization: authCode },
    });

    it(`creates a ${model}`, async () => {
      const response = await request();
      expect(response.statusCode).toEqual(200);
      let result = response.json();
      if (cleanUp) {
        result = cleanUp(result);
      }
      expect(
        sanitizeRecord({ record: result, model: db[model as keyof typeof db] })
      ).toEqual(
        sanitizeRecord({
          record: testData,
          model: db[model as keyof typeof db],
        })
      );
    });

    it('fails if required fields are missing', async () => {
      const invalidBody = { ...validBody };
      delete invalidBody[requiredFiled];
      const response = await request({ body: invalidBody });
      expect(response.statusCode).toEqual(400);
    });

    testAuthorizationErrors(request);
  });
};

import nock from 'nock';
import { describe, beforeEach, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getPOSTRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('POST /users/:userId/stash', () => {
  const scope = nock(process.env.RECOMMENDATIONS_API_BASE_URL!);

  const adminDb = getAdminDb();

  const userId = 123;

  const validPayload = {
    balance: 'thc',
    cannabinoids: ['thc', 'cbg'],
    conditions: ['anxiety', 'migraines'],
    effects: ['happy', 'creative'],
    flavors: ['earthy', 'skunk'],
    negatives: ['dryMouth'],
    symptoms: ['stress', 'muscleSpasms', 'pain'],
    terpenes: ['limonene'],
    thc: 16,
  };

  const request = getPOSTRequester({
    path: `/users/${userId}/stash`,
    defaultHeaders: { authorization: '' },
    defaultBody: validPayload,
  });

  beforeEach(async () => {
    await getAdminDbSeeder(adminDb)
      .withCannabinoids([])
      .withConditions([])
      .withEffects([])
      .withFlavors([])
      .withNegatives([])
      .withSymptoms([])
      .withTerpenes([])
      .withUsers([])
      .withUserStashes([])
      .withUserStashCannabinoids([])
      .withUserStashConditions([])
      .withUserStashEffects([])
      .withUserStashFlavors([])
      .withUserStashNegatives([])
      .withUserStashSymptoms([])
      .withUserStashTerpenes([]);
  });

  it('saves stash data', async () => {
    scope
      .put('/stashes/1', {
        balance: '1',
        thcLevel: '2',
        cannabinoids: [1, 2],
        conditions: [1, 2],
        effects: [1, 2],
        flavors: [1, 2],
        negatives: [1],
        symptoms: [1, 2, 3],
        terpenes: [1],
      })
      .reply(200, { success: true });

    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      success: true,
    });

    expect(scope.isDone()).toBe(true);

    const admin = {
      user: adminDb.query.user.findMany(),
      userStash: adminDb.query.userStash.findMany(),

      cannabinoid: adminDb.query.cannabinoid.findMany(),
      userStashCannabinoid: adminDb.query.userStashCannabinoid.findMany(),

      condition: adminDb.query.condition.findMany(),
      userStashCondition: adminDb.query.userStashCondition.findMany(),

      effect: adminDb.query.effect.findMany(),
      userStashEffect: adminDb.query.userStashEffect.findMany(),

      flavor: adminDb.query.flavor.findMany(),
      userStashFlavor: adminDb.query.userStashFlavor.findMany(),

      negative: adminDb.query.negative.findMany(),
      userStashNegative: adminDb.query.userStashNegative.findMany(),

      symptom: adminDb.query.symptom.findMany(),
      userStashSymptom: adminDb.query.userStashSymptom.findMany(),

      terpene: adminDb.query.terpene.findMany(),
      userStashTerpene: adminDb.query.userStashTerpene.findMany(),
    };

    await expect(admin.user).resolves.toEqual([{ id: 123 }]);

    await expect(admin.userStash).resolves.toEqual([
      { id: 1, userId: 123, balance: '1', thcLevel: '2' },
    ]);

    await expect(admin.cannabinoid).resolves.toEqual([
      { id: 1, key: 'thc', name: '' },
      { id: 2, key: 'cbg', name: '' },
    ]);

    await expect(admin.userStashCannabinoid).resolves.toEqual([
      { id: 1, userStashId: 1, cannabinoidId: 1 },
      { id: 2, userStashId: 1, cannabinoidId: 2 },
    ]);

    await expect(admin.condition).resolves.toEqual([
      { id: 1, key: 'anxiety', name: '' },
      { id: 2, key: 'migraines', name: '' },
    ]);

    await expect(admin.userStashCondition).resolves.toEqual([
      { id: 1, userStashId: 1, conditionId: 1 },
      { id: 2, userStashId: 1, conditionId: 2 },
    ]);

    await expect(admin.effect).resolves.toEqual([
      { id: 1, key: 'happy', name: '' },
      { id: 2, key: 'creative', name: '' },
    ]);

    await expect(admin.userStashEffect).resolves.toEqual([
      { id: 1, userStashId: 1, effectId: 1 },
      { id: 2, userStashId: 1, effectId: 2 },
    ]);

    await expect(admin.flavor).resolves.toEqual([
      { id: 1, key: 'earthy', name: '' },
      { id: 2, key: 'skunk', name: '' },
    ]);

    await expect(admin.userStashFlavor).resolves.toEqual([
      { id: 1, userStashId: 1, flavorId: 1 },
      { id: 2, userStashId: 1, flavorId: 2 },
    ]);

    await expect(admin.negative).resolves.toEqual([
      { id: 1, key: 'dryMouth', name: '' },
    ]);

    await expect(admin.userStashNegative).resolves.toEqual([
      { id: 1, userStashId: 1, negativeId: 1 },
    ]);

    await expect(admin.symptom).resolves.toEqual([
      { id: 1, key: 'stress', name: '' },
      { id: 2, key: 'muscleSpasms', name: '' },
      { id: 3, key: 'pain', name: '' },
    ]);

    await expect(admin.userStashSymptom).resolves.toEqual([
      { id: 1, userStashId: 1, symptomId: 1 },
      { id: 2, userStashId: 1, symptomId: 2 },
      { id: 3, userStashId: 1, symptomId: 3 },
    ]);

    await expect(admin.terpene).resolves.toEqual([
      { id: 1, key: 'limonene', name: '' },
    ]);

    await expect(admin.userStashTerpene).resolves.toEqual([
      { id: 1, userStashId: 1, terpeneId: 1 },
    ]);
  });

  it('saves stash data (duplicate call)', async () => {
    scope.put('/stashes/1').reply(200, { success: true });
    scope.put('/stashes/1').reply(200, { success: true });

    const response1 = await request();

    expect(response1.statusCode).toEqual(200);
    expect(response1.json()).toEqual({
      success: true,
    });

    const response2 = await request();

    expect(response2.statusCode).toEqual(200);
    expect(response2.json()).toEqual({
      success: true,
    });

    expect(scope.isDone()).toBe(true);

    const admin = {
      user: adminDb.query.user.findMany(),
      userStash: adminDb.query.userStash.findMany(),

      cannabinoid: adminDb.query.cannabinoid.findMany(),
      userStashCannabinoid: adminDb.query.userStashCannabinoid.findMany(),

      condition: adminDb.query.condition.findMany(),
      userStashCondition: adminDb.query.userStashCondition.findMany(),

      effect: adminDb.query.effect.findMany(),
      userStashEffect: adminDb.query.userStashEffect.findMany(),

      flavor: adminDb.query.flavor.findMany(),
      userStashFlavor: adminDb.query.userStashFlavor.findMany(),

      negative: adminDb.query.negative.findMany(),
      userStashNegative: adminDb.query.userStashNegative.findMany(),

      symptom: adminDb.query.symptom.findMany(),
      userStashSymptom: adminDb.query.userStashSymptom.findMany(),

      terpene: adminDb.query.terpene.findMany(),
      userStashTerpene: adminDb.query.userStashTerpene.findMany(),
    };

    await expect(admin.user).resolves.toEqual([{ id: 123 }]);

    await expect(admin.userStash).resolves.toEqual([
      { id: 1, userId: 123, balance: '1', thcLevel: '2' },
    ]);

    await expect(admin.cannabinoid).resolves.toEqual([
      { id: 1, key: 'thc', name: '' },
      { id: 2, key: 'cbg', name: '' },
    ]);

    await expect(admin.userStashCannabinoid).resolves.toEqual([
      { id: 1, userStashId: 1, cannabinoidId: 1 },
      { id: 2, userStashId: 1, cannabinoidId: 2 },
    ]);

    await expect(admin.condition).resolves.toEqual([
      { id: 1, key: 'anxiety', name: '' },
      { id: 2, key: 'migraines', name: '' },
    ]);

    await expect(admin.userStashCondition).resolves.toEqual([
      { id: 1, userStashId: 1, conditionId: 1 },
      { id: 2, userStashId: 1, conditionId: 2 },
    ]);

    await expect(admin.effect).resolves.toEqual([
      { id: 1, key: 'happy', name: '' },
      { id: 2, key: 'creative', name: '' },
    ]);

    await expect(admin.userStashEffect).resolves.toEqual([
      { id: 1, userStashId: 1, effectId: 1 },
      { id: 2, userStashId: 1, effectId: 2 },
    ]);

    await expect(admin.flavor).resolves.toEqual([
      { id: 1, key: 'earthy', name: '' },
      { id: 2, key: 'skunk', name: '' },
    ]);

    await expect(admin.userStashFlavor).resolves.toEqual([
      { id: 1, userStashId: 1, flavorId: 1 },
      { id: 2, userStashId: 1, flavorId: 2 },
    ]);

    await expect(admin.negative).resolves.toEqual([
      { id: 1, key: 'dryMouth', name: '' },
    ]);

    await expect(admin.userStashNegative).resolves.toEqual([
      { id: 1, userStashId: 1, negativeId: 1 },
    ]);

    await expect(admin.symptom).resolves.toEqual([
      { id: 1, key: 'stress', name: '' },
      { id: 2, key: 'muscleSpasms', name: '' },
      { id: 3, key: 'pain', name: '' },
    ]);

    await expect(admin.userStashSymptom).resolves.toEqual([
      { id: 1, userStashId: 1, symptomId: 1 },
      { id: 2, userStashId: 1, symptomId: 2 },
      { id: 3, userStashId: 1, symptomId: 3 },
    ]);

    await expect(admin.terpene).resolves.toEqual([
      { id: 1, key: 'limonene', name: '' },
    ]);

    await expect(admin.userStashTerpene).resolves.toEqual([
      { id: 1, userStashId: 1, terpeneId: 1 },
    ]);
  });

  it('throws 400 error when body is not valid', async () => {
    const response = await request({
      body: {
        conditions: { hello: 'world' },
      } as any,
    });

    expect(response.statusCode).toEqual(400);
    expect(response.json()).toEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'body/conditions Expected array, received object',
      statusCode: 400,
    });
  });

  testAuthorizationErrors(request);
});

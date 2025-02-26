import nock from 'nock';
import { describe, beforeEach, it, expect } from 'vitest';

import { getAdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

import { getPOSTRequester } from '../utils/getRequester';
import { testAuthorizationErrors } from '../utils/testAuthorizationErrors';

describe('POST /cultivars/:cultivar/recommendations', () => {
  const scope = nock(process.env.RECOMMENDATIONS_API_BASE_URL!);

  const adminDb = getAdminDb();

  const cultivarId = 4392;

  const validPayload = {
    cannabinoids: {
      thc: 17,
      cbg: 1,
      cbd: 0,
    },
    conditions: {
      addAdhd: 4,
      alzheimers: 0,
      anorexia: 0,
      anxiety: 156,
      arthritis: 1,
      asthma: 0,
      bipolarDisorder: 2,
      cachexia: 0,
      cancer: 2,
      crohnsDisease: 1,
      epilepsy: 2,
      fibromyalgia: 4,
      gastrointestinalDisorder: 1,
      glaucoma: 2,
      hivAids: 0,
      hypertension: 3,
      migraines: 58,
      multipleSclerosis: 0,
      muscularDystrophy: 1,
      parkinsons: 0,
      phantomLimbPain: 0,
      pms: 11,
      ptsd: 8,
      spinalCordInjury: 2,
      tinnitus: 0,
      tourettesSyndrome: 3,
    },
    effects: {
      relaxed: 25,
      happy: 123,
      euphoric: 172,
      uplifted: 126,
      focused: 82,
      sleepy: 39,
      creative: 129,
      giggly: 43,
      energetic: 71,
      talkative: 35,
      tingly: 36,
      hungry: 64,
      aroused: 29,
    },
    flavors: {
      ammonia: 0,
      apple: 0,
      apricot: 0,
      berry: 0,
      blueCheese: 0,
      blueberry: 1,
      butter: 0,
      cheese: 2,
      chemical: 0,
      chestnut: 0,
      citrus: 2,
      coffee: 2,
      diesel: 2,
      earthy: 11,
      flowery: 1,
      grape: 0,
      grapefruit: 0,
      honey: 0,
      lavender: 1,
      lemon: 0,
      lime: 1,
      mango: 1,
      menthol: 0,
      mint: 0,
      nutty: 2,
      orange: 2,
      peach: 0,
      pear: 0,
      pepper: 0,
      pine: 3,
      pineapple: 0,
      plum: 0,
      pungent: 7,
      rose: 0,
      sage: 1,
      skunk: 5,
      spicyHerbal: 1,
      strawberry: 0,
      sweet: 3,
      tar: 1,
      tea: 0,
      tobacco: 1,
      treeFruit: 2,
      tropical: 2,
      vanilla: 1,
      violet: 0,
      woody: 1,
    },
    negatives: {
      anxious: 3,
      dizzy: 45,
      dryEyes: 104,
      dryMouth: 154,
      headache: 36,
      paranoid: 43,
    },
    symptoms: {
      stress: 166,
      cramps: 4,
      eyePressure: 2,
      fatigue: 22,
      headaches: 6,
      inflammation: 5,
      insomnia: 70,
      lackOfAppetite: 9,
      muscleSpasms: 23,
      nausea: 61,
      pain: 126,
      seizures: 1,
      spasticity: 2,
    },
    terpenes: {
      myrcene: 0.854,
      caryophyllene: 0.3145,
      limonene: 0.3455,
      terpinolene: 0.0065,
      pinene: 0.1095,
      humulene: 0.1,
      linalool: 0.0905,
      ocimene: 0.0005,
    },
  };

  const request = getPOSTRequester({
    path: `/cultivars/${cultivarId}/recommendations`,
    defaultHeaders: { authorization: '' },
    defaultBody: validPayload,
  });

  beforeEach(async () => {
    await getAdminDbSeeder(adminDb)
      .withCannabinoids([])
      .withCultivarCannabinoids([])
      .withConditions([])
      .withCultivarConditions([])
      .withEffects([])
      .withCultivarEffects([])
      .withFlavors([])
      .withCultivarFlavors([])
      .withNegatives([])
      .withCultivarNegatives([])
      .withSymptoms([])
      .withCultivarSymptoms([])
      .withTerpenes([])
      .withCultivarTerpenes([]);
  });

  it('calculates & saves recommendations data', async () => {
    scope
      .put('/cultivars/4392', {
        balance: '1',
        thcLevel: '2',
        cannabinoids: [1, 2],
        conditions: [
          { id: 4, value: 'r4' },
          { id: 17, value: 'r4' },
        ],
        effects: [
          { id: 2, value: 'r1p5' },
          { id: 3, value: 'r2' },
          { id: 4, value: 'r1p5' },
          { id: 7, value: 'r1p5' },
        ],
        flavors: [
          { id: 8, value: 'r1p5' },
          { id: 11, value: 'r1p5' },
          { id: 12, value: 'r1p5' },
          { id: 13, value: 'r1p5' },
          { id: 14, value: 'r4' },
          { id: 25, value: 'r1p5' },
          { id: 26, value: 'r1p5' },
          { id: 30, value: 'r2' },
          { id: 33, value: 'r4' },
          { id: 36, value: 'r4' },
          { id: 39, value: 'r2' },
          { id: 43, value: 'r1p5' },
          { id: 44, value: 'r1p5' },
        ],
        negatives: [
          { id: 3, value: 'r1p5' },
          { id: 4, value: 'r2' },
        ],
        symptoms: [
          { id: 1, value: 'r4' },
          { id: 7, value: 'r1p5' },
          { id: 10, value: 'r1p5' },
          { id: 11, value: 'r3' },
        ],
        terpenes: [
          { id: 1, value: 'r3' },
          { id: 3, value: 'r1p5' },
        ],
      })
      .reply(200, { success: true });

    const response = await request();

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      success: true,
    });

    expect(scope.isDone()).toBe(true);

    const admin = {
      cannabinoid: adminDb.query.cannabinoid.findMany(),
      cultivarCannabinoid: adminDb.query.cultivarCannabinoid.findMany(),

      condition: adminDb.query.condition.findMany(),
      cultivarCondition: adminDb.query.cultivarCondition.findMany(),

      effect: adminDb.query.effect.findMany(),
      cultivarEffect: adminDb.query.cultivarEffect.findMany(),

      flavor: adminDb.query.flavor.findMany(),
      cultivarFlavor: adminDb.query.cultivarFlavor.findMany(),

      negative: adminDb.query.negative.findMany(),
      cultivarNegative: adminDb.query.cultivarNegative.findMany(),

      symptom: adminDb.query.symptom.findMany(),
      cultivarSymptom: adminDb.query.cultivarSymptom.findMany(),

      terpene: adminDb.query.terpene.findMany(),
      cultivarTerpene: adminDb.query.cultivarTerpene.findMany(),
    };

    await expect(admin.cannabinoid).resolves.toEqual([
      { id: 1, key: 'thc', name: '' },
      { id: 2, key: 'cbg', name: '' },
      { id: 3, key: 'cbd', name: '' },
    ]);

    await expect(admin.cultivarCannabinoid).resolves.toEqual([
      { id: 1, cultivarId, cannabinoidId: 1, value: 17 },
      { id: 2, cultivarId, cannabinoidId: 2, value: 1 },
    ]);

    await expect(admin.condition).resolves.toEqual([
      { id: 1, key: 'addAdhd', name: '' },
      { id: 2, key: 'alzheimers', name: '' },
      { id: 3, key: 'anorexia', name: '' },
      { id: 4, key: 'anxiety', name: '' },
      { id: 5, key: 'arthritis', name: '' },
      { id: 6, key: 'asthma', name: '' },
      { id: 7, key: 'bipolarDisorder', name: '' },
      { id: 8, key: 'cachexia', name: '' },
      { id: 9, key: 'cancer', name: '' },
      { id: 10, key: 'crohnsDisease', name: '' },
      { id: 11, key: 'epilepsy', name: '' },
      { id: 12, key: 'fibromyalgia', name: '' },
      { id: 13, key: 'gastrointestinalDisorder', name: '' },
      { id: 14, key: 'glaucoma', name: '' },
      { id: 15, key: 'hivAids', name: '' },
      { id: 16, key: 'hypertension', name: '' },
      { id: 17, key: 'migraines', name: '' },
      { id: 18, key: 'multipleSclerosis', name: '' },
      { id: 19, key: 'muscularDystrophy', name: '' },
      { id: 20, key: 'parkinsons', name: '' },
      { id: 21, key: 'phantomLimbPain', name: '' },
      { id: 22, key: 'pms', name: '' },
      { id: 23, key: 'ptsd', name: '' },
      { id: 24, key: 'spinalCordInjury', name: '' },
      { id: 25, key: 'tinnitus', name: '' },
      { id: 26, key: 'tourettesSyndrome', name: '' },
    ]);

    await expect(admin.cultivarCondition).resolves.toEqual([
      { id: 1, cultivarId, conditionId: 1, value: 4, recommendation: null },
      { id: 2, cultivarId, conditionId: 4, value: 156, recommendation: 'r4' },
      { id: 3, cultivarId, conditionId: 5, value: 1, recommendation: null },
      { id: 4, cultivarId, conditionId: 7, value: 2, recommendation: null },
      { id: 5, cultivarId, conditionId: 9, value: 2, recommendation: null },
      { id: 6, cultivarId, conditionId: 10, value: 1, recommendation: null },
      { id: 7, cultivarId, conditionId: 11, value: 2, recommendation: null },
      { id: 8, cultivarId, conditionId: 12, value: 4, recommendation: null },
      { id: 9, cultivarId, conditionId: 13, value: 1, recommendation: null },
      { id: 10, cultivarId, conditionId: 14, value: 2, recommendation: null },
      { id: 11, cultivarId, conditionId: 16, value: 3, recommendation: null },
      { id: 12, cultivarId, conditionId: 17, value: 58, recommendation: 'r4' },
      { id: 13, cultivarId, conditionId: 19, value: 1, recommendation: null },
      { id: 14, cultivarId, conditionId: 22, value: 11, recommendation: null },
      { id: 15, cultivarId, conditionId: 23, value: 8, recommendation: null },
      { id: 16, cultivarId, conditionId: 24, value: 2, recommendation: null },
      { id: 17, cultivarId, conditionId: 26, value: 3, recommendation: null },
    ]);

    await expect(admin.effect).resolves.toEqual([
      { id: 1, key: 'relaxed', name: '' },
      { id: 2, key: 'happy', name: '' },
      { id: 3, key: 'euphoric', name: '' },
      { id: 4, key: 'uplifted', name: '' },
      { id: 5, key: 'focused', name: '' },
      { id: 6, key: 'sleepy', name: '' },
      { id: 7, key: 'creative', name: '' },
      { id: 8, key: 'giggly', name: '' },
      { id: 9, key: 'energetic', name: '' },
      { id: 10, key: 'talkative', name: '' },
      { id: 11, key: 'tingly', name: '' },
      { id: 12, key: 'hungry', name: '' },
      { id: 13, key: 'aroused', name: '' },
    ]);

    await expect(admin.cultivarEffect).resolves.toEqual([
      { id: 1, cultivarId, effectId: 1, value: 25, recommendation: null },
      { id: 2, cultivarId, effectId: 2, value: 123, recommendation: 'r1p5' },
      { id: 3, cultivarId, effectId: 3, value: 172, recommendation: 'r2' },
      { id: 4, cultivarId, effectId: 4, value: 126, recommendation: 'r1p5' },
      { id: 5, cultivarId, effectId: 5, value: 82, recommendation: null },
      { id: 6, cultivarId, effectId: 6, value: 39, recommendation: null },
      { id: 7, cultivarId, effectId: 7, value: 129, recommendation: 'r1p5' },
      { id: 8, cultivarId, effectId: 8, value: 43, recommendation: null },
      { id: 9, cultivarId, effectId: 9, value: 71, recommendation: null },
      { id: 10, cultivarId, effectId: 10, value: 35, recommendation: null },
      { id: 11, cultivarId, effectId: 11, value: 36, recommendation: null },
      { id: 12, cultivarId, effectId: 12, value: 64, recommendation: null },
      { id: 13, cultivarId, effectId: 13, value: 29, recommendation: null },
    ]);

    await expect(admin.flavor).resolves.toEqual([
      { id: 1, key: 'ammonia', name: '' },
      { id: 2, key: 'apple', name: '' },
      { id: 3, key: 'apricot', name: '' },
      { id: 4, key: 'berry', name: '' },
      { id: 5, key: 'blueCheese', name: '' },
      { id: 6, key: 'blueberry', name: '' },
      { id: 7, key: 'butter', name: '' },
      { id: 8, key: 'cheese', name: '' },
      { id: 9, key: 'chemical', name: '' },
      { id: 10, key: 'chestnut', name: '' },
      { id: 11, key: 'citrus', name: '' },
      { id: 12, key: 'coffee', name: '' },
      { id: 13, key: 'diesel', name: '' },
      { id: 14, key: 'earthy', name: '' },
      { id: 15, key: 'flowery', name: '' },
      { id: 16, key: 'grape', name: '' },
      { id: 17, key: 'grapefruit', name: '' },
      { id: 18, key: 'honey', name: '' },
      { id: 19, key: 'lavender', name: '' },
      { id: 20, key: 'lemon', name: '' },
      { id: 21, key: 'lime', name: '' },
      { id: 22, key: 'mango', name: '' },
      { id: 23, key: 'menthol', name: '' },
      { id: 24, key: 'mint', name: '' },
      { id: 25, key: 'nutty', name: '' },
      { id: 26, key: 'orange', name: '' },
      { id: 27, key: 'peach', name: '' },
      { id: 28, key: 'pear', name: '' },
      { id: 29, key: 'pepper', name: '' },
      { id: 30, key: 'pine', name: '' },
      { id: 31, key: 'pineapple', name: '' },
      { id: 32, key: 'plum', name: '' },
      { id: 33, key: 'pungent', name: '' },
      { id: 34, key: 'rose', name: '' },
      { id: 35, key: 'sage', name: '' },
      { id: 36, key: 'skunk', name: '' },
      { id: 37, key: 'spicyHerbal', name: '' },
      { id: 38, key: 'strawberry', name: '' },
      { id: 39, key: 'sweet', name: '' },
      { id: 40, key: 'tar', name: '' },
      { id: 41, key: 'tea', name: '' },
      { id: 42, key: 'tobacco', name: '' },
      { id: 43, key: 'treeFruit', name: '' },
      { id: 44, key: 'tropical', name: '' },
      { id: 45, key: 'vanilla', name: '' },
      { id: 46, key: 'violet', name: '' },
      { id: 47, key: 'woody', name: '' },
    ]);

    await expect(admin.cultivarFlavor).resolves.toEqual([
      { id: 1, cultivarId, flavorId: 6, value: 1, recommendation: null },
      { id: 2, cultivarId, flavorId: 8, value: 2, recommendation: 'r1p5' },
      { id: 3, cultivarId, flavorId: 11, value: 2, recommendation: 'r1p5' },
      { id: 4, cultivarId, flavorId: 12, value: 2, recommendation: 'r1p5' },
      { id: 5, cultivarId, flavorId: 13, value: 2, recommendation: 'r1p5' },
      { id: 6, cultivarId, flavorId: 14, value: 11, recommendation: 'r4' },
      { id: 7, cultivarId, flavorId: 15, value: 1, recommendation: null },
      { id: 8, cultivarId, flavorId: 19, value: 1, recommendation: null },
      { id: 9, cultivarId, flavorId: 21, value: 1, recommendation: null },
      { id: 10, cultivarId, flavorId: 22, value: 1, recommendation: null },
      { id: 11, cultivarId, flavorId: 25, value: 2, recommendation: 'r1p5' },
      { id: 12, cultivarId, flavorId: 26, value: 2, recommendation: 'r1p5' },
      { id: 13, cultivarId, flavorId: 30, value: 3, recommendation: 'r2' },
      { id: 14, cultivarId, flavorId: 33, value: 7, recommendation: 'r4' },
      { id: 15, cultivarId, flavorId: 35, value: 1, recommendation: null },
      { id: 16, cultivarId, flavorId: 36, value: 5, recommendation: 'r4' },
      { id: 17, cultivarId, flavorId: 37, value: 1, recommendation: null },
      { id: 18, cultivarId, flavorId: 39, value: 3, recommendation: 'r2' },
      { id: 19, cultivarId, flavorId: 40, value: 1, recommendation: null },
      { id: 20, cultivarId, flavorId: 42, value: 1, recommendation: null },
      { id: 21, cultivarId, flavorId: 43, value: 2, recommendation: 'r1p5' },
      { id: 22, cultivarId, flavorId: 44, value: 2, recommendation: 'r1p5' },
      { id: 23, cultivarId, flavorId: 45, value: 1, recommendation: null },
      { id: 24, cultivarId, flavorId: 47, value: 1, recommendation: null },
    ]);

    await expect(admin.negative).resolves.toEqual([
      { id: 1, key: 'anxious', name: '' },
      { id: 2, key: 'dizzy', name: '' },
      { id: 3, key: 'dryEyes', name: '' },
      { id: 4, key: 'dryMouth', name: '' },
      { id: 5, key: 'headache', name: '' },
      { id: 6, key: 'paranoid', name: '' },
    ]);

    await expect(admin.cultivarNegative).resolves.toEqual([
      { id: 1, cultivarId, negativeId: 1, value: 3, recommendation: null },
      { id: 2, cultivarId, negativeId: 2, value: 45, recommendation: null },
      { id: 3, cultivarId, negativeId: 3, value: 104, recommendation: 'r1p5' },
      { id: 4, cultivarId, negativeId: 4, value: 154, recommendation: 'r2' },
      { id: 5, cultivarId, negativeId: 5, value: 36, recommendation: null },
      { id: 6, cultivarId, negativeId: 6, value: 43, recommendation: null },
    ]);

    await expect(admin.symptom).resolves.toEqual([
      { id: 1, key: 'stress', name: '' },
      { id: 2, key: 'cramps', name: '' },
      { id: 3, key: 'eyePressure', name: '' },
      { id: 4, key: 'fatigue', name: '' },
      { id: 5, key: 'headaches', name: '' },
      { id: 6, key: 'inflammation', name: '' },
      { id: 7, key: 'insomnia', name: '' },
      { id: 8, key: 'lackOfAppetite', name: '' },
      { id: 9, key: 'muscleSpasms', name: '' },
      { id: 10, key: 'nausea', name: '' },
      { id: 11, key: 'pain', name: '' },
      { id: 12, key: 'seizures', name: '' },
      { id: 13, key: 'spasticity', name: '' },
    ]);

    await expect(admin.cultivarSymptom).resolves.toEqual([
      { id: 1, cultivarId, symptomId: 1, value: 166, recommendation: 'r4' },
      { id: 2, cultivarId, symptomId: 2, value: 4, recommendation: null },
      { id: 3, cultivarId, symptomId: 3, value: 2, recommendation: null },
      { id: 4, cultivarId, symptomId: 4, value: 22, recommendation: null },
      { id: 5, cultivarId, symptomId: 5, value: 6, recommendation: null },
      { id: 6, cultivarId, symptomId: 6, value: 5, recommendation: null },
      { id: 7, cultivarId, symptomId: 7, value: 70, recommendation: 'r1p5' },
      { id: 8, cultivarId, symptomId: 8, value: 9, recommendation: null },
      { id: 9, cultivarId, symptomId: 9, value: 23, recommendation: null },
      { id: 10, cultivarId, symptomId: 10, value: 61, recommendation: 'r1p5' },
      { id: 11, cultivarId, symptomId: 11, value: 126, recommendation: 'r3' },
      { id: 12, cultivarId, symptomId: 12, value: 1, recommendation: null },
      { id: 13, cultivarId, symptomId: 13, value: 2, recommendation: null },
    ]);

    await expect(admin.terpene).resolves.toEqual([
      { id: 1, key: 'myrcene', name: '' },
      { id: 2, key: 'caryophyllene', name: '' },
      { id: 3, key: 'limonene', name: '' },
      { id: 4, key: 'terpinolene', name: '' },
      { id: 5, key: 'pinene', name: '' },
      { id: 6, key: 'humulene', name: '' },
      { id: 7, key: 'linalool', name: '' },
      { id: 8, key: 'ocimene', name: '' },
    ]);

    await expect(admin.cultivarTerpene).resolves.toEqual([
      { id: 1, cultivarId, terpeneId: 1, value: '0.854', recommendation: 'r3' },
      {
        id: 2,
        cultivarId,
        terpeneId: 2,
        value: '0.3145',
        recommendation: null,
      },
      {
        id: 3,
        cultivarId,
        terpeneId: 3,
        value: '0.3455',
        recommendation: 'r1p5',
      },
      {
        id: 4,
        cultivarId,
        terpeneId: 4,
        value: '0.0065',
        recommendation: null,
      },
      {
        id: 5,
        cultivarId,
        terpeneId: 5,
        value: '0.1095',
        recommendation: null,
      },
      { id: 6, cultivarId, terpeneId: 6, value: '0.1', recommendation: null },
      {
        id: 7,
        cultivarId,
        terpeneId: 7,
        value: '0.0905',
        recommendation: null,
      },
      {
        id: 8,
        cultivarId,
        terpeneId: 8,
        value: '0.0005',
        recommendation: null,
      },
    ]);
  });

  it('calculates & saves recommendations data (duplicate call)', async () => {
    scope.put('/cultivars/4392').reply(200, { success: true });
    scope.put('/cultivars/4392').reply(200, { success: true });

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
      cannabinoid: adminDb.query.cannabinoid.findMany(),
      cultivarCannabinoid: adminDb.query.cultivarCannabinoid.findMany(),

      condition: adminDb.query.condition.findMany(),
      cultivarCondition: adminDb.query.cultivarCondition.findMany(),

      effect: adminDb.query.effect.findMany(),
      cultivarEffect: adminDb.query.cultivarEffect.findMany(),

      flavor: adminDb.query.flavor.findMany(),
      cultivarFlavor: adminDb.query.cultivarFlavor.findMany(),

      negative: adminDb.query.negative.findMany(),
      cultivarNegative: adminDb.query.cultivarNegative.findMany(),

      symptom: adminDb.query.symptom.findMany(),
      cultivarSymptom: adminDb.query.cultivarSymptom.findMany(),

      terpene: adminDb.query.terpene.findMany(),
      cultivarTerpene: adminDb.query.cultivarTerpene.findMany(),
    };

    await expect(admin.cannabinoid).resolves.toEqual([
      { id: 1, key: 'thc', name: '' },
      { id: 2, key: 'cbg', name: '' },
      { id: 3, key: 'cbd', name: '' },
    ]);

    await expect(admin.cultivarCannabinoid).resolves.toEqual([
      { id: 1, cultivarId, cannabinoidId: 1, value: 17 },
      { id: 2, cultivarId, cannabinoidId: 2, value: 1 },
    ]);

    await expect(admin.condition).resolves.toEqual([
      { id: 1, key: 'addAdhd', name: '' },
      { id: 2, key: 'alzheimers', name: '' },
      { id: 3, key: 'anorexia', name: '' },
      { id: 4, key: 'anxiety', name: '' },
      { id: 5, key: 'arthritis', name: '' },
      { id: 6, key: 'asthma', name: '' },
      { id: 7, key: 'bipolarDisorder', name: '' },
      { id: 8, key: 'cachexia', name: '' },
      { id: 9, key: 'cancer', name: '' },
      { id: 10, key: 'crohnsDisease', name: '' },
      { id: 11, key: 'epilepsy', name: '' },
      { id: 12, key: 'fibromyalgia', name: '' },
      { id: 13, key: 'gastrointestinalDisorder', name: '' },
      { id: 14, key: 'glaucoma', name: '' },
      { id: 15, key: 'hivAids', name: '' },
      { id: 16, key: 'hypertension', name: '' },
      { id: 17, key: 'migraines', name: '' },
      { id: 18, key: 'multipleSclerosis', name: '' },
      { id: 19, key: 'muscularDystrophy', name: '' },
      { id: 20, key: 'parkinsons', name: '' },
      { id: 21, key: 'phantomLimbPain', name: '' },
      { id: 22, key: 'pms', name: '' },
      { id: 23, key: 'ptsd', name: '' },
      { id: 24, key: 'spinalCordInjury', name: '' },
      { id: 25, key: 'tinnitus', name: '' },
      { id: 26, key: 'tourettesSyndrome', name: '' },
    ]);

    await expect(admin.cultivarCondition).resolves.toEqual([
      { id: 1, cultivarId, conditionId: 1, value: 4, recommendation: null },
      { id: 2, cultivarId, conditionId: 4, value: 156, recommendation: 'r4' },
      { id: 3, cultivarId, conditionId: 5, value: 1, recommendation: null },
      { id: 4, cultivarId, conditionId: 7, value: 2, recommendation: null },
      { id: 5, cultivarId, conditionId: 9, value: 2, recommendation: null },
      { id: 6, cultivarId, conditionId: 10, value: 1, recommendation: null },
      { id: 7, cultivarId, conditionId: 11, value: 2, recommendation: null },
      { id: 8, cultivarId, conditionId: 12, value: 4, recommendation: null },
      { id: 9, cultivarId, conditionId: 13, value: 1, recommendation: null },
      { id: 10, cultivarId, conditionId: 14, value: 2, recommendation: null },
      { id: 11, cultivarId, conditionId: 16, value: 3, recommendation: null },
      { id: 12, cultivarId, conditionId: 17, value: 58, recommendation: 'r4' },
      { id: 13, cultivarId, conditionId: 19, value: 1, recommendation: null },
      { id: 14, cultivarId, conditionId: 22, value: 11, recommendation: null },
      { id: 15, cultivarId, conditionId: 23, value: 8, recommendation: null },
      { id: 16, cultivarId, conditionId: 24, value: 2, recommendation: null },
      { id: 17, cultivarId, conditionId: 26, value: 3, recommendation: null },
    ]);

    await expect(admin.effect).resolves.toEqual([
      { id: 1, key: 'relaxed', name: '' },
      { id: 2, key: 'happy', name: '' },
      { id: 3, key: 'euphoric', name: '' },
      { id: 4, key: 'uplifted', name: '' },
      { id: 5, key: 'focused', name: '' },
      { id: 6, key: 'sleepy', name: '' },
      { id: 7, key: 'creative', name: '' },
      { id: 8, key: 'giggly', name: '' },
      { id: 9, key: 'energetic', name: '' },
      { id: 10, key: 'talkative', name: '' },
      { id: 11, key: 'tingly', name: '' },
      { id: 12, key: 'hungry', name: '' },
      { id: 13, key: 'aroused', name: '' },
    ]);

    await expect(admin.cultivarEffect).resolves.toEqual([
      { id: 1, cultivarId, effectId: 1, value: 25, recommendation: null },
      { id: 2, cultivarId, effectId: 2, value: 123, recommendation: 'r1p5' },
      { id: 3, cultivarId, effectId: 3, value: 172, recommendation: 'r2' },
      { id: 4, cultivarId, effectId: 4, value: 126, recommendation: 'r1p5' },
      { id: 5, cultivarId, effectId: 5, value: 82, recommendation: null },
      { id: 6, cultivarId, effectId: 6, value: 39, recommendation: null },
      { id: 7, cultivarId, effectId: 7, value: 129, recommendation: 'r1p5' },
      { id: 8, cultivarId, effectId: 8, value: 43, recommendation: null },
      { id: 9, cultivarId, effectId: 9, value: 71, recommendation: null },
      { id: 10, cultivarId, effectId: 10, value: 35, recommendation: null },
      { id: 11, cultivarId, effectId: 11, value: 36, recommendation: null },
      { id: 12, cultivarId, effectId: 12, value: 64, recommendation: null },
      { id: 13, cultivarId, effectId: 13, value: 29, recommendation: null },
    ]);

    await expect(admin.flavor).resolves.toEqual([
      { id: 1, key: 'ammonia', name: '' },
      { id: 2, key: 'apple', name: '' },
      { id: 3, key: 'apricot', name: '' },
      { id: 4, key: 'berry', name: '' },
      { id: 5, key: 'blueCheese', name: '' },
      { id: 6, key: 'blueberry', name: '' },
      { id: 7, key: 'butter', name: '' },
      { id: 8, key: 'cheese', name: '' },
      { id: 9, key: 'chemical', name: '' },
      { id: 10, key: 'chestnut', name: '' },
      { id: 11, key: 'citrus', name: '' },
      { id: 12, key: 'coffee', name: '' },
      { id: 13, key: 'diesel', name: '' },
      { id: 14, key: 'earthy', name: '' },
      { id: 15, key: 'flowery', name: '' },
      { id: 16, key: 'grape', name: '' },
      { id: 17, key: 'grapefruit', name: '' },
      { id: 18, key: 'honey', name: '' },
      { id: 19, key: 'lavender', name: '' },
      { id: 20, key: 'lemon', name: '' },
      { id: 21, key: 'lime', name: '' },
      { id: 22, key: 'mango', name: '' },
      { id: 23, key: 'menthol', name: '' },
      { id: 24, key: 'mint', name: '' },
      { id: 25, key: 'nutty', name: '' },
      { id: 26, key: 'orange', name: '' },
      { id: 27, key: 'peach', name: '' },
      { id: 28, key: 'pear', name: '' },
      { id: 29, key: 'pepper', name: '' },
      { id: 30, key: 'pine', name: '' },
      { id: 31, key: 'pineapple', name: '' },
      { id: 32, key: 'plum', name: '' },
      { id: 33, key: 'pungent', name: '' },
      { id: 34, key: 'rose', name: '' },
      { id: 35, key: 'sage', name: '' },
      { id: 36, key: 'skunk', name: '' },
      { id: 37, key: 'spicyHerbal', name: '' },
      { id: 38, key: 'strawberry', name: '' },
      { id: 39, key: 'sweet', name: '' },
      { id: 40, key: 'tar', name: '' },
      { id: 41, key: 'tea', name: '' },
      { id: 42, key: 'tobacco', name: '' },
      { id: 43, key: 'treeFruit', name: '' },
      { id: 44, key: 'tropical', name: '' },
      { id: 45, key: 'vanilla', name: '' },
      { id: 46, key: 'violet', name: '' },
      { id: 47, key: 'woody', name: '' },
    ]);

    await expect(admin.cultivarFlavor).resolves.toEqual([
      { id: 1, cultivarId, flavorId: 6, value: 1, recommendation: null },
      { id: 2, cultivarId, flavorId: 8, value: 2, recommendation: 'r1p5' },
      { id: 3, cultivarId, flavorId: 11, value: 2, recommendation: 'r1p5' },
      { id: 4, cultivarId, flavorId: 12, value: 2, recommendation: 'r1p5' },
      { id: 5, cultivarId, flavorId: 13, value: 2, recommendation: 'r1p5' },
      { id: 6, cultivarId, flavorId: 14, value: 11, recommendation: 'r4' },
      { id: 7, cultivarId, flavorId: 15, value: 1, recommendation: null },
      { id: 8, cultivarId, flavorId: 19, value: 1, recommendation: null },
      { id: 9, cultivarId, flavorId: 21, value: 1, recommendation: null },
      { id: 10, cultivarId, flavorId: 22, value: 1, recommendation: null },
      { id: 11, cultivarId, flavorId: 25, value: 2, recommendation: 'r1p5' },
      { id: 12, cultivarId, flavorId: 26, value: 2, recommendation: 'r1p5' },
      { id: 13, cultivarId, flavorId: 30, value: 3, recommendation: 'r2' },
      { id: 14, cultivarId, flavorId: 33, value: 7, recommendation: 'r4' },
      { id: 15, cultivarId, flavorId: 35, value: 1, recommendation: null },
      { id: 16, cultivarId, flavorId: 36, value: 5, recommendation: 'r4' },
      { id: 17, cultivarId, flavorId: 37, value: 1, recommendation: null },
      { id: 18, cultivarId, flavorId: 39, value: 3, recommendation: 'r2' },
      { id: 19, cultivarId, flavorId: 40, value: 1, recommendation: null },
      { id: 20, cultivarId, flavorId: 42, value: 1, recommendation: null },
      { id: 21, cultivarId, flavorId: 43, value: 2, recommendation: 'r1p5' },
      { id: 22, cultivarId, flavorId: 44, value: 2, recommendation: 'r1p5' },
      { id: 23, cultivarId, flavorId: 45, value: 1, recommendation: null },
      { id: 24, cultivarId, flavorId: 47, value: 1, recommendation: null },
    ]);

    await expect(admin.negative).resolves.toEqual([
      { id: 1, key: 'anxious', name: '' },
      { id: 2, key: 'dizzy', name: '' },
      { id: 3, key: 'dryEyes', name: '' },
      { id: 4, key: 'dryMouth', name: '' },
      { id: 5, key: 'headache', name: '' },
      { id: 6, key: 'paranoid', name: '' },
    ]);

    await expect(admin.cultivarNegative).resolves.toEqual([
      { id: 1, cultivarId, negativeId: 1, value: 3, recommendation: null },
      { id: 2, cultivarId, negativeId: 2, value: 45, recommendation: null },
      { id: 3, cultivarId, negativeId: 3, value: 104, recommendation: 'r1p5' },
      { id: 4, cultivarId, negativeId: 4, value: 154, recommendation: 'r2' },
      { id: 5, cultivarId, negativeId: 5, value: 36, recommendation: null },
      { id: 6, cultivarId, negativeId: 6, value: 43, recommendation: null },
    ]);

    await expect(admin.symptom).resolves.toEqual([
      { id: 1, key: 'stress', name: '' },
      { id: 2, key: 'cramps', name: '' },
      { id: 3, key: 'eyePressure', name: '' },
      { id: 4, key: 'fatigue', name: '' },
      { id: 5, key: 'headaches', name: '' },
      { id: 6, key: 'inflammation', name: '' },
      { id: 7, key: 'insomnia', name: '' },
      { id: 8, key: 'lackOfAppetite', name: '' },
      { id: 9, key: 'muscleSpasms', name: '' },
      { id: 10, key: 'nausea', name: '' },
      { id: 11, key: 'pain', name: '' },
      { id: 12, key: 'seizures', name: '' },
      { id: 13, key: 'spasticity', name: '' },
    ]);

    await expect(admin.cultivarSymptom).resolves.toEqual([
      { id: 1, cultivarId, symptomId: 1, value: 166, recommendation: 'r4' },
      { id: 2, cultivarId, symptomId: 2, value: 4, recommendation: null },
      { id: 3, cultivarId, symptomId: 3, value: 2, recommendation: null },
      { id: 4, cultivarId, symptomId: 4, value: 22, recommendation: null },
      { id: 5, cultivarId, symptomId: 5, value: 6, recommendation: null },
      { id: 6, cultivarId, symptomId: 6, value: 5, recommendation: null },
      { id: 7, cultivarId, symptomId: 7, value: 70, recommendation: 'r1p5' },
      { id: 8, cultivarId, symptomId: 8, value: 9, recommendation: null },
      { id: 9, cultivarId, symptomId: 9, value: 23, recommendation: null },
      { id: 10, cultivarId, symptomId: 10, value: 61, recommendation: 'r1p5' },
      { id: 11, cultivarId, symptomId: 11, value: 126, recommendation: 'r3' },
      { id: 12, cultivarId, symptomId: 12, value: 1, recommendation: null },
      { id: 13, cultivarId, symptomId: 13, value: 2, recommendation: null },
    ]);

    await expect(admin.terpene).resolves.toEqual([
      { id: 1, key: 'myrcene', name: '' },
      { id: 2, key: 'caryophyllene', name: '' },
      { id: 3, key: 'limonene', name: '' },
      { id: 4, key: 'terpinolene', name: '' },
      { id: 5, key: 'pinene', name: '' },
      { id: 6, key: 'humulene', name: '' },
      { id: 7, key: 'linalool', name: '' },
      { id: 8, key: 'ocimene', name: '' },
    ]);

    await expect(admin.cultivarTerpene).resolves.toEqual([
      { id: 1, cultivarId, terpeneId: 1, value: '0.854', recommendation: 'r3' },
      {
        id: 2,
        cultivarId,
        terpeneId: 2,
        value: '0.3145',
        recommendation: null,
      },
      {
        id: 3,
        cultivarId,
        terpeneId: 3,
        value: '0.3455',
        recommendation: 'r1p5',
      },
      {
        id: 4,
        cultivarId,
        terpeneId: 4,
        value: '0.0065',
        recommendation: null,
      },
      {
        id: 5,
        cultivarId,
        terpeneId: 5,
        value: '0.1095',
        recommendation: null,
      },
      { id: 6, cultivarId, terpeneId: 6, value: '0.1', recommendation: null },
      {
        id: 7,
        cultivarId,
        terpeneId: 7,
        value: '0.0905',
        recommendation: null,
      },
      {
        id: 8,
        cultivarId,
        terpeneId: 8,
        value: '0.0005',
        recommendation: null,
      },
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
      message: 'body/conditions/hello Expected number, received string',
      statusCode: 400,
    });
  });

  testAuthorizationErrors(request);
});

import type { AdminDb } from '@backend-api/admin-db/db';
import { getAdminDbSeeder } from '@backend-api/admin-db/db-seeder';

export const matches = [
  { id: 1, match: 1 },
  { id: 4, match: 1 },
  { id: 2, match: 0.75 },
  { id: 3, match: 0.375 },
];

export const stash = {
  conditions: ['arthritis'],
  effects: ['relaxed', 'focused', 'creative'],
  flavors: [],
  negatives: ['anxious', 'headache'],
  symptoms: ['pain', 'inflammation', 'muscleSpasms', 'fatigue'],
  terpenes: ['eucalyptol', 'linalool'],

  balance: 'cbd',
  cannabinoids: ['cbg'],
  thc: 5,
};

export function prepareAdminDbDataSet(
  db: AdminDb,
  userId: number
): PromiseLike<void> {
  return getAdminDbSeeder(db)
    .withCannabinoids([
      { id: 1, key: 'thc', name: '' },
      { id: 2, key: 'cbd', name: '' },
      { id: 3, key: 'cbg', name: '' },
    ])
    .withConditions([{ id: 1, key: 'arthritis', name: '' }])
    .withEffects([
      { id: 1, key: 'relaxed', name: '' },
      { id: 2, key: 'focused', name: '' },
      { id: 3, key: 'creative', name: '' },
    ])
    .withFlavors([{ id: 1, key: 'apple', name: '' }])
    .withNegatives([])
    .withSymptoms([
      { id: 1, key: 'pain', name: '' },
      { id: 2, key: 'inflammation', name: '' },
      { id: 3, key: 'muscleSpasms', name: '' },
      { id: 4, key: 'fatigue', name: '' },
    ])
    .withTerpenes([
      { id: 1, key: 'eucalyptol', name: '' },
      { id: 2, key: 'linalool', name: '' },
    ])
    .withUserStashes([{ id: 1, userId }]);
}

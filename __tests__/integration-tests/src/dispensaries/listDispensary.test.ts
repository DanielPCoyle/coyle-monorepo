import { listRecordsEndpointTest } from '../utils/apiRoutesTest/listRecordsEndpointTest';

import { dispensaryTestRecord } from './dispensaryTestRecord';

listRecordsEndpointTest({
  endpoint: 'dispensaries',
  withFunctionName: 'withDispensaries',
  testData: [dispensaryTestRecord(1), dispensaryTestRecord(2)],
  fieldsToTest: ['id', 'state'],
  orderBy: 'city',
});

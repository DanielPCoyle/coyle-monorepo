import { listRecordsEndpointTest } from '../utils/apiRoutesTest/listRecordsEndpointTest';

import { baseLocationTestRecord } from './baseLocationTestRecord';

listRecordsEndpointTest({
  endpoint: 'base-locations',
  withFunctionName: 'withBaseLocations',
  testData: [baseLocationTestRecord(1), baseLocationTestRecord(2)],
  fieldsToTest: ['id', 'state'],
  orderBy: 'city',
});

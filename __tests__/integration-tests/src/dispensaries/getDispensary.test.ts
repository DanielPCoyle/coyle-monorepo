import { getSingleRecordEndpointTest } from '../utils/apiRoutesTest/getSingleRecordEndpointTest';

import { dispensaryTestRecord } from './dispensaryTestRecord';

getSingleRecordEndpointTest({
  endpoint: 'dispensaries',
  model: 'dispensary',
  testData: [dispensaryTestRecord(1), dispensaryTestRecord(2)],
  withFunctionName: 'withDispensaries',
});

import { getSingleRecordEndpointTest } from '../utils/apiRoutesTest/getSingleRecordEndpointTest';

import { baseLocationTestRecord } from './baseLocationTestRecord';

getSingleRecordEndpointTest({
  endpoint: 'base-locations',
  model: 'BaseLocation',
  testData: [baseLocationTestRecord(1), baseLocationTestRecord(2)],
  withFunctionName: 'withBaseLocations',
});

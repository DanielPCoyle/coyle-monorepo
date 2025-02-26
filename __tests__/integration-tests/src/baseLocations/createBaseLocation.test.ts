import { createRecordEndpointTest } from '../utils/apiRoutesTest/createRecordEndpointTest';

import { baseLocationTestRecord } from './baseLocationTestRecord';

const testData: any = baseLocationTestRecord(1);
delete testData?.lastScraped; // lastScraped is optional and auto filled with current date
delete testData?.id;

testData.latitude = parseFloat(testData.latitude);
testData.longitude = parseFloat(testData.longitude);

createRecordEndpointTest({
  endpoint: 'base-locations',
  testData,
  model: 'baseLocation',
  requiredFiled: 'state',
  cleanUp: (record: any) => {
    const newRecord = { ...record };
    delete newRecord?.id;
    delete newRecord?.lastScraped;
    return newRecord;
  },
});

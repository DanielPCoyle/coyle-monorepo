import { createRecordEndpointTest } from '../utils/apiRoutesTest/createRecordEndpointTest';

import { dispensaryTestRecord } from './dispensaryTestRecord';

const testData: any = dispensaryTestRecord(1);
delete testData?.lastScraped; // lastScraped is optional and auto filled with current date
delete testData?.id;
delete testData?.menuItemCountUpdatedAt;
delete testData?.reviewCountUpdatedAt;
delete testData?.detailsUpdatedAt;

testData.latitude = parseFloat(testData.latitude);
testData.longitude = parseFloat(testData.longitude);

createRecordEndpointTest({
  endpoint: 'dispensaries',
  testData,
  model: 'dispensary',
  requiredFiled: 'state',
  cleanUp: (record: any) => {
    const newRecord = { ...record };
    delete newRecord?.id;
    delete newRecord?.menuItemCountUpdatedAt;
    delete newRecord?.reviewCountUpdatedAt;
    delete newRecord?.detailsUpdatedAt;
    return newRecord;
  },
});

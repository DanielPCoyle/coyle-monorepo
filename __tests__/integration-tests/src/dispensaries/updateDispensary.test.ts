import { updateRecordEndpointTest } from '../utils/apiRoutesTest/updateRecordEndpointTest';

import { dispensaryTestRecord } from './dispensaryTestRecord';

const testData: any = dispensaryTestRecord(1);
delete testData?.lastScraped; // lastScraped is optional and auto filled with current date
delete testData?.id;
delete testData?.menuItemCountUpdatedAt;
delete testData?.reviewCountUpdatedAt;
delete testData?.detailsUpdatedAt;

testData.latitude = parseFloat(testData.latitude);
testData.longitude = parseFloat(testData.longitude);

updateRecordEndpointTest({
  endpoint: 'dispensaries',
  model: 'dispensary',
  testData,
  withFunc: 'withDispensaries',
  updateData: { ...testData, name: 'new name' },
  cleanUp: (record: any) => {
    const newRecord = { ...record };
    delete newRecord?.id;
    newRecord.latitude = parseFloat(newRecord.latitude);
    newRecord.longitude = parseFloat(newRecord.longitude);
    delete newRecord?.menuItemCountUpdatedAt;
    delete newRecord?.reviewCountUpdatedAt;
    delete newRecord?.detailsUpdatedAt;
    return newRecord;
  },
});

import { updateRecordEndpointTest } from '../utils/apiRoutesTest/updateRecordEndpointTest';

import { baseLocationTestRecord } from './baseLocationTestRecord';

const testData: any = baseLocationTestRecord(1);
delete testData?.lastScraped; // lastScraped is optional and auto filled with current date
delete testData?.id;

testData.latitude = parseFloat(testData.latitude);
testData.longitude = parseFloat(testData.longitude);

updateRecordEndpointTest({
  endpoint: 'base-locations',
  model: 'baseLocation',
  testData,
  withFunc: 'withBaseLocations',
  updateData: { ...testData, city: 'new name' },
  cleanUp: (record: any) => {
    const newRecord = { ...record };
    delete newRecord?.id;
    delete newRecord?.lastScraped;
    newRecord.latitude = parseFloat(newRecord.latitude);
    newRecord.longitude = parseFloat(newRecord.longitude);
    return newRecord;
  },
});

import API from '@aws-amplify/api';
import awsConfig from '../../../aws-exports';
import profileApiParams from '../../../amplify/backend/api/profileApi/api-params.json';

API.configure(awsConfig);

export const profileApiConf = {
  apiName: profileApiParams.apiName,
};
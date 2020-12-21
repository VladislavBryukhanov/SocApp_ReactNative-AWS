import API from '@aws-amplify/api';
import awsConfig from '../../../aws-exports';
import profileApiParams from '../../../amplify/backend/api/profileApi/api-params.json';
import chatRoomApiParams from '../../../amplify/backend/api/chatRoomsApi/api-params.json';
import s3ProxyApiParams from '../../../amplify/backend/api/accessS3FileProxyEndpoint/api-params.json';

API.configure(awsConfig);

export const ApiConfigs = {
  profile: profileApiParams,
  chatRooms: chatRoomApiParams,
  s3Proxy: s3ProxyApiParams
};

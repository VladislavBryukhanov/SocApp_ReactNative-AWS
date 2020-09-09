import API from '@aws-amplify/api';
import awsConfig from '../../../aws-exports';
import profileApiParams from '../../../amplify/backend/api/profileApi/api-params.json';
import chatRoomApiParams from '../../../amplify/backend/api/chatRoomsApi/api-params.json';

API.configure(awsConfig);

export const ApiConfigs = {
  profile: profileApiParams,
  chatRooms: chatRoomApiParams,
};

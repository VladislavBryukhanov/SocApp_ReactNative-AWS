import mrParams from '../../../amplify/backend/storage/mediaResources/parameters.json';
import { AMPLIFY_ENV } from 'react-native-dotenv';

export const mediaResources = {
  bucket: `${mrParams.bucketName}${AMPLIFY_ENV}-${AMPLIFY_ENV}`
};
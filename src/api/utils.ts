import { API } from 'aws-amplify';
import { ApiConfigs } from './api-gateway/api-configs';
import { CognitoAuth } from './auth';

export const imageViewRequestOptions = async (s3Key: string) => {
  const [ token, endpoint ] = await Promise.all([
    CognitoAuth.retreiveSessionToken(),
    API.endpoint(ApiConfigs.s3Proxy.apiName),
  ]);

  return {
    uri: `${endpoint}/${s3Key}`,
    method: 'GET',
    headers: { Authorization: token },
  }
}
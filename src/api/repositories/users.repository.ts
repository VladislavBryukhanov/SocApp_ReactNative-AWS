import API from '@aws-amplify/api';
import { profileApiConf } from '@api/api-gateway/api-configs';
import { CognitoAuth } from '@api/auth';
import { User } from '@models/user';
import lambdaInvoker from '../lambdaInvoker';
import { HttpApi } from '@api/api-gateway/native-api';

class UsersRepository {
  // private http?: HttpApi;
  
  // get httpApi() {
  //   if (!this.http) {
  //     this.http = new HttpApi('https://jopv2yzjvb.execute-api.us-east-1.amazonaws.com/dev/');
  //   }

  //   return this.http;
  // }

  // async fetchProfile(): Promise<User> {
  //   return this.httpApi.get<{ profile: User }>().then(({ profile }) => profile);
  // }

  // async editProfile(changes: Partial<User>) {
  //   await this.httpApi.put<{ profile: User }, Partial<User>>(changes);
  // }

  async list(): Promise<User[]> {
    const result = await lambdaInvoker.invoke<string>('listUsers');
    const { Items: userList } = JSON.parse(result);

    return userList;
  }

  async fetchProfile(): Promise<User> {
    const { apiName } = profileApiConf;
    const token = await CognitoAuth.retreiveSessionToken();
    const requestParams = { 
      headers: { Authorization: token } 
    };

    const { profile } = await API.get(apiName, '/fetch', requestParams);

    return profile;
  }

  async editProfile(changes: Partial<User>): Promise<User> {
    const { apiName } = profileApiConf;
    const token = await CognitoAuth.retreiveSessionToken();
    const requestParams = { 
      headers: { Authorization: token },
      body: changes 
    };

    return API.put(apiName, '/update', requestParams);
  }

  async uploadProfileAvatar(
    base64File: string,
    fileType: string,
    extension: string
  ): Promise<{ s3Key: string }> {
    const { apiName } = profileApiConf;
    const token = await CognitoAuth.retreiveSessionToken();
    const requestParams = {
      headers: { Authorization: token },
      body: { base64File, fileType, extension }
    };

    return API.post(apiName, '/uploadAvatar', requestParams);
  }
}

export default new UsersRepository();
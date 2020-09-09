import API from '@aws-amplify/api';
import { ApiConfigs } from '@api/api-gateway/api-configs';
import { User } from '@models/user';
import lambdaInvoker from '../lambdaInvoker';
import { BaseRepository } from './base.repository';
// import { HttpApi } from '@api/api-gateway/native-api';

class UsersRepository extends BaseRepository {
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
    const authHeader = await this.buildAuthHeader();
    return API.get(this.apiName, '/fetch', { headers: authHeader })
      .then(({ profile }) => profile);
  }

  async updateNotificationToken(notificationToken: string) {
    const authHeader = await this.buildAuthHeader();
    const requestParams = { 
      headers: authHeader,
      body: { notificationToken }
    };

    return API.put(this.apiName, '/notificationToken', requestParams);
  }

  async editProfile(changes: Partial<User>): Promise<User> {
    const authHeader = await this.buildAuthHeader();
    const requestParams = { 
      headers: authHeader,
      body: changes 
    };

    return API.put(this.apiName, '/update', requestParams);
  }

  async uploadProfileAvatar(
    base64File: string,
    fileType: string,
    extension: string
  ): Promise<{ s3Key: string }> {
    const authHeader = await this.buildAuthHeader();
    const requestParams = {
      headers: authHeader,
      body: { base64File, fileType, extension }
    };

    return API.post(this.apiName, '/uploadAvatar', requestParams);
  }
}

export default new UsersRepository(ApiConfigs.profile.apiName);
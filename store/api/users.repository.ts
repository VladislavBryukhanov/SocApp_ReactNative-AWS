import { User } from '../../types/user';

import uuidv4 from 'uuid/v4';
import API, { APIClass } from '@aws-amplify/api';
import awsConfig from '../../aws-exports';
import apiParams from '../../amplify/backend/api/socAppApi/api-params.json';
// import AWS from 'aws-sdk/aws-sdk-react-native';

API.configure(awsConfig);



export class UsersRepository {
  static list() {

  }

  static create(user: User) {
    const init = {
      response: true,
      body: {
        ...user,
        id: uuidv4()
      }
    };

    return API.post(apiParams.apiName, apiParams.paths[0].name, init);
  }

  static update() {

  }

  static delete() {
    
  }
}
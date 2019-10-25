import uuidv4 from 'uuid/v4';
import API, { APIClass } from '@aws-amplify/api';
import awsConfig from '../../aws-exports';
import apiParams from '../../amplify/backend/api/socAppApi/api-params.json';
// import AWS from 'aws-sdk/aws-sdk-react-native';

API.configure(awsConfig);

// const init = {
//   response: true,
//   body: {
//     id: uuidv4(),
//     username: username
//   }
// };

// API.post(apiParams.apiName, apiParams.paths[0].name, init);

export class ApiInstance  {
  api: APIClass;

  constructor(config: any) {
    this.api = API.configure(config)
  }

  get() {

  }

  post() {

  }

  put() {

  }

  delete() {

  }

}
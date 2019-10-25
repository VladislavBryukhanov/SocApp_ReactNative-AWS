import uuidv4 from 'uuid/v4';
import API from '@aws-amplify/api';
import awsConfig from '../../aws-exports';
import apiParams from '../../amplify/backend/api/socAppApi/api-params.json';

API.configure(awsConfig);

export class ApiInstance {
  config = {
    apiName: apiParams.apiName,
    path: apiParams.paths[0].name
  };

  constructor(config?: any) {
    this.config = config || this.config;
  }

  get(): Promise<any> {
    const request = {
      response: true
    };
    
    return API.get(
      this.config.apiName,
      this.config.path,
      request
    );
  }

  post<T>(payload: T) {
    const request = {
      response: true,
      body: {
        id: uuidv4(),
        ...payload
      }
    };

    return API.post(
      this.config.apiName,
      this.config.path,
      request
    );
  }

  put() {

  }

  delete() {

  }

}
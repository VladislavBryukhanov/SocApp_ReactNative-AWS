import { CognitoAuth } from './auth';
import AWS, { CognitoIdentityCredentials } from 'aws-sdk';
import { User } from '@models/user';
import database from './experimental/database';
import uuidv4 from 'uuid/v4';
import awsmobile from '../../aws-exports';

const params = {
  TableName: 'localDB-env'
};

class UsersRepository {
  async list(): Promise<User[]> {
    const credentials = await CognitoAuth.getAwsConfigCredentials();
    AWS.config.credentials = new CognitoIdentityCredentials(credentials);
    AWS.config.update({ region: awsmobile.aws_project_region });

    const lambda = new AWS.Lambda({
      apiVersion: '2015-03-31',
      correctClockSkew: true
    });
    const params = {
      FunctionName: 'createUser-env',
    };

    lambda.invoke(params, (err, data) => {
      console.log('LMBD_INV');
      console.log(err);
      console.log(data);
    });

    return [] as User[];
    // return database.scan(params)
    //   .then(res => res.Items as User[]);
  }

  create(user: User): Promise<User> {
    return database.create({
      ...params,
      Item: { id: uuidv4(), ...user }
    }).then(res => res as User);
  }

  update() {

  }
 
  delete() {
    
  }
}

export default new UsersRepository();
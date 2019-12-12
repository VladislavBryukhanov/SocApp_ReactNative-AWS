import { User } from '@models/user';
import { DatabaseInstance } from './database';
import normilizeResponse from '../utils/NormilizeDynamoDbResponse';

const dynamoDb = new DatabaseInstance();
const params = {
  TableName: 'localDB-env'
};

export class UsersRepository {
  
  static list(): Promise<User[]> {
    return dynamoDb.scan(params)
      .then(res => normilizeResponse<User>(res));

    // return await api.get()
      // .then(res => res.data);
  }

  static create(user: User): Promise<User> {
    // const { config: { data: newUser } } = await api.post<User>(user);
    // return JSON.parse(newUser);

    return dynamoDb.create(params, user)
      .then(res => normilizeResponse<User>(res));
  }

  static update() {

  }
 
  static delete() {
    
  }
}
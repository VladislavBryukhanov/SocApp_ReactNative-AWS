import { User } from '../types/user';
import { DatabaseInstance } from './database';
import normilizeResponse from '../utils/NormilizeDynamoDbResponse';

const dynamoDb = new DatabaseInstance();

export class UsersRepository {
  
  static async list(): Promise<User[]> {
    const params = {
      TableName: 'localDB-env'
    };

    return await dynamoDb.scan(params)
      .then(res => normilizeResponse<User>(res));

    // return await api.get()
      // .then(res => res.data);
  }

  static async create(user: User): Promise<User> {
    // const { config: { data: newUser } } = await api.post<User>(user);
    // return JSON.parse(newUser);

    return await dynamoDb.create(params, user)
      .then(res => normilizeResponse<User>(res));
  }

  static update() {

  }
 
  static delete() {
    
  }
}
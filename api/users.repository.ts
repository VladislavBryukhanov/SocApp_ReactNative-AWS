import { User } from '../types/user';
import { DatabaseInstance } from './database';

const dynamoDb = new DatabaseInstance();

export class UsersRepository {
  
  static async list(): Promise<User[]> {
    const params = {
      TableName: 'localDB-env',
      // Item: {
      //   'CUSTOMER_ID' : {N: '001'},
      //   'CUSTOMER_NAME' : {S: 'Richard Roe'}
      // }
    };

    return await dynamoDb.get(params)
      .then(res => res.Items) as User[];
      
    // return await api.get()
      // .then(res => res.data);
  }

  static async create(user: User): Promise<User> {
    // const { config: { data: newUser } } = await api.post<User>(user);
    // return JSON.parse(newUser);
  }

  static update() {

  }
 
  static delete() {
    
  }
}
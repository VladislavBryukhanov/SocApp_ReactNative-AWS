import { User } from '@models/user';
import { DatabaseInstance } from './database';
import normilizeResponse from '../utils/NormilizeDynamoDbResponse';

const params = {
  TableName: 'localDB-env'
};

class UsersRepository {
  _dynamoDb?: DatabaseInstance;

  get dynamoDb() {
    if (!this._dynamoDb) {
      this._dynamoDb = new DatabaseInstance();
    }

    return this._dynamoDb;
  }

  list(): Promise<User[]> {
    return this.dynamoDb.scan(params)
      .then(res => normilizeResponse<User>(res));

    // return await api.get()
      // .then(res => res.data);
  }

  create(user: User): Promise<User> {
    // const { config: { data: newUser } } = await api.post<User>(user);
    // return JSON.parse(newUser);

    return this.dynamoDb.create(params, user)
      .then(res => normilizeResponse<User>(res));
  }

  update() {

  }
 
  delete() {
    
  }
}

export default new UsersRepository();
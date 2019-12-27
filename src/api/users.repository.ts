import { User } from '@models/user';
import database from './database';
import uuidv4 from 'uuid/v4';

const params = {
  TableName: 'localDB-env'
};

class UsersRepository {
  list(): Promise<User[]> {
    return database.scan(params)
      .then(res => res.Items as User[]);
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
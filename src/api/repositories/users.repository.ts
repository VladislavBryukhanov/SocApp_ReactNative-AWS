import { User } from '@models/user';
import database from '../experimental/database';
import uuidv4 from 'uuid/v4';
import lambdaInvoker from '../lambdaInvoker';

class UsersRepository {
  async list(): Promise<User[]> {
    const result = await lambdaInvoker.invoke<string>('listUsers');
    const { Items: userList } = JSON.parse(result);

    return userList as User[];
  }
}

export default new UsersRepository();
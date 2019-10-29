import { User } from '../types/user';
import { ApiInstance } from './api';

const api = new ApiInstance();

export class UsersRepository {
  
  static async list(): Promise<User[]> {
    return await api.get()
      .then(res => res.data);
  }

  static async create(user: User): Promise<User> {
    const { config: { data: newUser } } = await api.post<User>(user);
    return JSON.parse(newUser);
  }

  static update() {

  }

  static delete() {
    
  }
}
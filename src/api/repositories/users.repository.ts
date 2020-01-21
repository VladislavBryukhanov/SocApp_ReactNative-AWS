import AWS from 'aws-sdk';
import { User } from '@models/user';
import lambdaInvoker from '../lambdaInvoker';

class UsersRepository {
  async list(): Promise<User[]> {
    const result = await lambdaInvoker.invoke<string>('listUsers');
    const { Items: userList } = JSON.parse(result);

    return userList;
  }

  async fetchProfile(cognitoUsername: string): Promise<User> {
    const clientContextPayload = { cognitoUsername };
    const ClientContext = AWS.util.base64.encode(
      JSON.stringify(clientContextPayload)
    );

    const result = await lambdaInvoker.invoke<string>(
      'fetchProfile',
      { ClientContext }
    );
    const { Item: profile } = JSON.parse(result);

    return profile;
  }

  async editProfile(cognitoUsername: string, changes: Partial<User>) {
    const clientContextPayload = { cognitoUsername };
    const ClientContext = AWS.util.base64.encode(
      JSON.stringify(clientContextPayload)
    );

    const Payload = JSON.stringify(changes);

    const result = await lambdaInvoker.invoke<string>(
      'editProfile',
      { ClientContext, Payload }
    );
    const { Item: profile } = JSON.parse(result);

    console.log(profile);

    return profile;
  }
}

export default new UsersRepository();
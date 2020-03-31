export interface User extends Credentials, UserAttributes {
  id?: string;
  avatar?: string;
  bio?: string;
  age? :number;
  snsCreds?: SNSCredentials;
};

export type Credentials = {
  email: string;
  password: string;
}

export type UserAttributes = {
  username: string;
  nickname: string;
};

export type SNSCredentials = {
  notificationToken: string;
  EndpointArn: string;
  SubscriptionArn: string;
}
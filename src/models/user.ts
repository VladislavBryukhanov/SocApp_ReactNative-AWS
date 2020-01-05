export interface User extends Credentials, UserAttributes {
  id?: string;
  avatar?: string;
  bio?: string;
  age? :number;
};

export type Credentials = {
  email: string;
  password: string;
}

export type UserAttributes = {
  username: string;
  nickname: string;
};

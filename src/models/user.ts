export interface User extends Credentials {
  id?: string;
  username: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
  age? :number;
};

export type Credentials = {
  email: string;
  password: string;
}
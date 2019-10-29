export interface User extends Credentials {
  id?: string;
  email: string;
  avatar?: string;
};

export type Credentials = {
  email: string;
  password: string;
}
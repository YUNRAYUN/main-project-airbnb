import { User } from '../entities/user.entity';

export interface IUsersServiceCreate {
  email: string;
  hashedPassword: string;
  name: string;
  age: number;
}

export interface IUsersServiceFindOne {
  email: string;
}

export interface IUserServiceUpdate {
  user: User;
}

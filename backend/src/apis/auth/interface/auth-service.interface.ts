import { User } from 'src/apis/airbnb/users/entities/user.entity';
import { IAuthUserItem } from 'src/commons/types/context';
import { Response } from 'express';

export interface IAuthServiceGetAccessToken {
  user: User | IAuthUserItem;
}

export interface IAuthServiceSetRefreshToken {
  user: User;
  res: Response;
}

export interface IOAuthUser {
  user: {
    name: string;
    email: string;
    hashedPassword: string;
    age: number;
  };
}

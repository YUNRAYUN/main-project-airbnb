import { IAuthUser } from 'src/commons/types/context';

export interface IRentsPaymentsServiceCreate {
  impUid: string;
  amount: number;
  user: IAuthUser['user'];
}

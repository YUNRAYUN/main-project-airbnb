import {
  ConflictException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { IamportService } from 'src/apis/iamport/iamport.service';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { IContext } from 'src/commons/types/context';
import { Repository } from 'typeorm';
import { RentsPayment } from './entities/rentPayment.entity';
import { RentsPaymentsService } from './rentPayment.service';

@Resolver()
export class RentsPaymentsResolver {
  constructor(
    private readonly rentsPaymentService: RentsPaymentsService,
    private readonly iamportService: IamportService,

    @InjectRepository(RentsPayment)
    private readonly rentsPaymentsRepository: Repository<RentsPayment>,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => RentsPayment)
  async createRentPayment(
    @Args('impUid') impUid: string, //
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ): Promise<RentsPayment> {
    const accessToken = await this.iamportService.getIamportAccessToken();
    await this.iamportService.fetchPaymentData({
      accessToken,
      impUid,
    });
    console.log(accessToken);
    // if (!paymentData) {
    //   throw new UnprocessableEntityException('유효하지 않습니다');
    // }
    const result = await this.rentsPaymentsRepository.findOne({
      where: { impUid },
    });
    if (result) {
      throw new ConflictException('이미 결제한 건 입니다.');
    }

    const user = context.req.user;
    console.log(user);
    return this.rentsPaymentService.create({ impUid, amount, user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => RentsPayment)
  async cancelRentPayment(
    @Args('impUid') impUid: string, //
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ): Promise<RentsPayment> {
    const result1 = await this.rentsPaymentsRepository.findOne({
      where: { impUid },
    });
    if (result1.status === 'CANCEL') {
      throw new UnprocessableEntityException('이미 취소된 결제 건 입니다');
    }
    const user = context.req.user;
    const accessToken = await this.iamportService.getIamportAccessToken();
    const result2 = await this.iamportService.getCancelData({
      accessToken,
      impUid,
      amount,
      user,
    });
    return result2;
  }
}

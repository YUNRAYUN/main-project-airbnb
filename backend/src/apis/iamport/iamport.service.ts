import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { DataSource, Repository } from 'typeorm';
import {
  POINT_TRANSACTION_STATUS_ENUM,
  RentsPayment,
} from '../airbnb/payments/entities/rentPayment.entity';
import { RentsPaymentsService } from '../airbnb/payments/rentPayment.service';
import { User } from '../airbnb/users/entities/user.entity';

@Injectable()
export class IamportService {
  constructor(
    private readonly rentspaymentService: RentsPaymentsService, //

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(RentsPayment)
    private readonly rentsPaymentsRepository: Repository<RentsPayment>,

    private readonly dataSource: DataSource,
  ) {}
  // Iamport에서 토큰 발급 요청
  async getIamportAccessToken() {
    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
      data: {
        imp_key: process.env.IMP_KEY, // REST API키
        imp_secret: process.env.IMP_SECRET, // REST API Secret
      },
    });
    return getToken.data.response.access_token;
  }

  // 발급받은 IamportAccessToken 포함 결제 상세내역 조회
  async fetchPaymentData({ accessToken, impUid }) {
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
      method: 'get', // GET method
      headers: { Authorization: accessToken }, // 인증 토큰 Authorization header에 추가
    }).catch((err) => {
      throw new UnprocessableEntityException('유효하지 않습니다.');
    });
    return getPaymentData.data;
  }

  // 결제 환불요청
  async getCancelData({ accessToken, impUid, amount, user }) {
    const getCancelData = await axios({
      url: 'https://api.iamport.kr/payments/cancel',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken, // 아임포트 서버로부터 발급받은 엑세스 토큰
      },
      data: {
        imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
        amount, // 가맹점 클라이언트로부터 받은 환불금액
      },
    });

    if (getCancelData.data.response === null) {
      throw new UnprocessableEntityException('유효하지 않는 아이디 입니다.');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // const result = await this.userRepository.findOne({
      //   where: { id: user.id },
      // });

      const result = await queryRunner.manager.findOne(User, {
        where: { id: user.id },
        lock: { mode: 'pessimistic_write' },
      });

      // await this.userRepository.update(
      //   { id: user.id },
      //   { point: result.point - amount },
      // );
      const updatedUser = this.userRepository.create({
        ...result,
        point: result.point - amount,
      });
      await queryRunner.manager.save(updatedUser);

      const payment = this.rentsPaymentsRepository.create({
        impUid,
        amount: -amount,
        user,
        status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
      });
      const result3 = await queryRunner.manager.save(payment);

      await queryRunner.commitTransaction();
      return result3;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

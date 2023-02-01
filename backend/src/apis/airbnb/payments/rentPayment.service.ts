import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  RentsPayment,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/rentPayment.entity';
import { IRentsPaymentsServiceCreate } from './interfaces/rentsPayment-service.interface';

@Injectable()
export class RentsPaymentsService {
  constructor(
    @InjectRepository(RentsPayment)
    private readonly rentPaymentRepository: Repository<RentsPayment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async create({
    impUid,
    amount,
    user: _user,
  }: IRentsPaymentsServiceCreate): Promise<RentsPayment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const rentsPayment = this.rentPaymentRepository.create({
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });

      await queryRunner.manager.save(rentsPayment);

      // const rentsPay = await this.rentPaymentRepository.save({
      //   impUid,
      //   amount,
      //   user: _user,
      //   status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      // })

      // const user1 = await this.usersRepository.findOne({
      //   where: { id: _user.id },
      // });
      const user1 = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      // await this.usersRepository.update(
      //   { id: user1.id },
      //   { point: user1.point + amount },
      // );
      const updatedUser = this.usersRepository.create({
        ...user1,
        point: user1.point + amount,
      });

      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      return rentsPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportService } from 'src/apis/iamport/iamport.service';
import { User } from '../users/entities/user.entity';
import { RentsPayment } from './entities/rentPayment.entity';
import { RentsPaymentsResolver } from './rentPayment.resolver';
import { RentsPaymentsService } from './rentPayment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RentsPayment, //
      User,
    ]),
  ],
  providers: [
    RentsPaymentsResolver, //
    RentsPaymentsService,
    IamportService,
  ],
})
export class RentsPaymentsModule {}

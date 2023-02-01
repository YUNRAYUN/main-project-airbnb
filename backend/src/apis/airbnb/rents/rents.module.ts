import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentCategory } from '../rentsCategories/entities/rentCategory.entity';
import { RentChecktime } from '../rentsChecktime/entities/rentChecktime.entity';
import { RentImage } from '../rentsImages/entities/rentImage.entity';
import { RentLocation } from '../rentsLocations/entities/rentLocation.entity';
import { RentTag } from '../rentsTags/entities/rentTags.entity';
import { Rent } from './entities/rent.entity';
import { RentsResolver } from './rents.resolver';
import { RentsService } from './rents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rent, //
      RentLocation,
      RentTag,
      RentChecktime,
      RentCategory,
      RentImage,
    ]),
  ],
  providers: [
    RentsResolver, //
    RentsService,
  ],
})
export class RentsModule {}

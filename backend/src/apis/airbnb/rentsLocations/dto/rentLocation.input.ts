import { InputType, OmitType } from '@nestjs/graphql';
import { RentLocation } from '../entities/rentLocation.entity';

@InputType()
export class RentLocationInput extends OmitType(
  RentLocation,
  ['id'],
  InputType,
) {}

import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Rent } from '../../rents/entities/rent.entity';
import { RentInFacility } from '../../rentsInFacility/entities/rentInFacility.entity';

@Entity()
export class RentFacility {
  @PrimaryColumn()
  facility_number: number;

  @ManyToOne(() => RentInFacility)
  rentInFacility: RentInFacility;

  @ManyToOne(() => Rent)
  rent: Rent;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RentInFacility {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  in_facility: string;
}

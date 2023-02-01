import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rent } from '../../rents/entities/rent.entity';

@ObjectType()
@Entity()
export class RentImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  image: string;

  @ManyToOne(() => Rent)
  @Field(() => Rent)
  rent: Rent;
}

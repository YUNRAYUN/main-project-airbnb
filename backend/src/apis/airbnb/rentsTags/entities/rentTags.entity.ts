import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rent } from '../../rents/entities/rent.entity';

@Entity()
@ObjectType()
export class RentTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToMany(() => Rent, (rents) => rents.rentTags)
  @Field(() => [Rent])
  rents: Rent[];
}

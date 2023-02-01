import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rent } from '../../rents/entities/rent.entity';

@Entity()
@ObjectType()
export class RentCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  category: string;

  @ManyToMany(() => Rent, (rents) => rents.rentCategories)
  @Field(() => [Rent])
  rent: Rent[];
}

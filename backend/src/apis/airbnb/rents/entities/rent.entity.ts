import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RentsPayment } from '../../payments/entities/rentPayment.entity';
import { RentCategory } from '../../rentsCategories/entities/rentCategory.entity';
import { RentChecktime } from '../../rentsChecktime/entities/rentChecktime.entity';
import { RentLocation } from '../../rentsLocations/entities/rentLocation.entity';
import { User } from '../../users/entities/user.entity';
import { RentTag } from '../../rentsTags/entities/rentTags.entity';
@Entity()
@ObjectType()
export class Rent {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Int)
  price: number;

  @ManyToOne(() => User)
  @Field(() => User)
  users: User;

  @JoinColumn()
  @OneToOne(() => RentLocation)
  @Field(() => RentLocation)
  rentLocation: RentLocation;

  @JoinColumn()
  @OneToOne(() => RentChecktime)
  @Field(() => RentChecktime)
  RentChecktime: RentChecktime;

  @JoinColumn()
  @OneToOne(() => RentsPayment)
  @Field(() => RentsPayment)
  rentPayment: RentsPayment;

  @JoinTable()
  @ManyToMany(() => RentCategory, (rentCategories) => rentCategories.rent)
  @Field(() => [RentCategory])
  rentCategories: RentCategory[];

  @JoinTable()
  @ManyToMany(() => RentTag, (rentTags) => rentTags.rents)
  @Field(() => [RentTag])
  rentTags: RentTag[];

  @DeleteDateColumn()
  deletedAt: Date;
}

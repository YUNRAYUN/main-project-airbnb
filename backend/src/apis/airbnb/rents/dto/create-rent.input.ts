import { Field, InputType, Int } from '@nestjs/graphql';
import { RentLocationInput } from '../../rentsLocations/dto/rentLocation.input';

@InputType()
export class CreateRentInput {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => RentLocationInput)
  rentLocation: RentLocationInput;

  // @Field(() => String)
  // rentCategoryId: string;

  @Field(() => [String])
  rentTags: string[];
}

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRentInput } from './create-rent.input';

@InputType()
export class UpdateRentInput extends PartialType(CreateRentInput) {}

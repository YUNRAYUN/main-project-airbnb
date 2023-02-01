import { CreateRentInput } from '../dto/create-rent.input';
import { UpdateRentInput } from '../dto/update-rent.input';
import { Rent } from '../entities/rent.entity';

export interface IRentsServiceCreate {
  createRentInput: CreateRentInput;
  imageUrl: string[];
}

export interface IRentsServiceFindOne {
  rentId: string;
}

export interface IRentServiceUpdate {
  rent: Rent;
  updateRentInput: UpdateRentInput;
  imageUrl: string[];
}

export interface IRentsServiceDelete {
  rentId: string;
}

export interface IRentsServiceRestore {
  rentId: string;
}

import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateRentInput } from './dto/create-rent.input';
import { UpdateRentInput } from './dto/update-rent.input';
import { Rent } from './entities/rent.entity';
import { RentsService } from './rents.service';

@Resolver()
export class RentsResolver {
  constructor(
    private readonly rentsService: RentsService, //
  ) {}
  @Query(() => [Rent])
  fetchRents(): Promise<Rent[]> {
    return this.rentsService.findAll();
  }

  @Query(() => Rent)
  fetchRent(
    @Args('rentId') rentId: string, //
  ): Promise<Rent> {
    return this.rentsService.findOne({ rentId });
  }

  @Mutation(() => Rent)
  createRent(
    @Args('createRentInput') createRentInput: CreateRentInput,
    @Args({ name: 'imageUrl', type: () => [String] }) imageUrl: string[],
  ) {
    return this.rentsService.create({ createRentInput, imageUrl });
  }

  @Query(() => [Rent])
  fetchRentWithDelelted() {
    return this.rentsService.findAllWithDeleted();
  }

  @Mutation(() => Rent)
  async updateRent(
    @Args('rentId') rentId: string,
    @Args('updateRentInput') updateRentInput: UpdateRentInput,
    @Args({ name: 'imageUrl', type: () => [String] }) imageUrl: string[],
  ) {
    return this.rentsService.update({ rentId, updateRentInput, imageUrl });
  }

  @Mutation(() => Boolean)
  deleteRent(
    @Args('rentId') rentId: string, //
  ): Promise<boolean> {
    return this.rentsService.delete({ rentId });
  }

  @Mutation(() => Boolean)
  restoreRent(
    @Args('rentId') rentId: string, //
  ): Promise<boolean> {
    return this.rentsService.restore({ rentId });
  }
}

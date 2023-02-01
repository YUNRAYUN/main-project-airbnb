// import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import { RentImage } from './entities/rentImage.entity';
// import { RentImageService } from './rentImage.service';

// @Resolver()
// export class RentImageResolver {
//   constructor(
//     private readonly rentImageService: RentImageService, //
//   ) {}

//   @Mutation(() => [RentImage])
//   createRentImage(
//     @Args('rentId')
//     rentId: string,
//     @Args({ name: 'imageUrl', type: () => [String] })
//     imageUrl: string[],
//   ) {
//     return this.rentImageService.create({ rentId, imageUrl });
//   }

//   @Mutation(() => [RentImage])
//   updateRentImage(
//     @Args('rentId')
//     rentId: string,
//     @Args({ name: 'imageUrl', type: () => [String] })
//     imageUrl: string[],
//   ) {
//     return this.rentImageService.updateRentImage({ rentId, imageUrl });
//   }
// }

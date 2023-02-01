// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Rent } from '../rents/entities/rent.entity';
// import { RentImage } from './entities/rentImage.entity';

// @Injectable()
// export class RentImageService {
//   constructor(
//     @InjectRepository(RentImage)
//     private readonly rentImageRepository: Repository<RentImage>,

//     @InjectRepository(Rent)
//     private readonly rentRepository: Repository<Rent>,
//   ) {}

//   async create({ rentId, imageUrl }) {
//     const rentImage = await this.rentRepository.findOne({
//       where: { id: rentId },
//     });
//     for (let i = 0; i < imageUrl.length; i++) {
//       return await this.rentImageRepository.save({
//         rent: rentId, // 수정필요
//         rentImage: imageUrl[i],
//       });
//     }
//     return rentImage;
//   }

//   async updateImage({ rentId, imageUrl }) {
//     const rentImage = await this.rentRepository.findOne({
//       where: { id: rentId },
//     });
//   }
// }

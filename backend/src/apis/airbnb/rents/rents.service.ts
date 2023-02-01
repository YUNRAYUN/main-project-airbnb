import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentImage } from '../rentsImages/entities/rentImage.entity';
import { RentLocation } from '../rentsLocations/entities/rentLocation.entity';
import { RentTag } from '../rentsTags/entities/rentTags.entity';

import { Rent } from './entities/rent.entity';
import {
  IRentsServiceCreate,
  IRentsServiceFindOne,
} from './interfaces/rent-service.interface';

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent)
    private readonly rentsRepository: Repository<Rent>, //

    @InjectRepository(RentLocation)
    private readonly rentsLocationsRepository: Repository<RentLocation>,

    @InjectRepository(RentTag)
    private readonly rentsTagsRepository: Repository<RentTag>,

    @InjectRepository(RentImage)
    private readonly rentImageRepository: Repository<RentImage>,
  ) {}

  findAll(): Promise<Rent[]> {
    return this.rentsRepository.find({
      relations: ['rentLocation', 'rentTags'],
    });
  }

  findAllWithDeleted(): Promise<Rent[]> {
    return this.rentsRepository.find({
      withDeleted: true,
    });
  }

  findOne({ rentId }: IRentsServiceFindOne): Promise<Rent> {
    return this.rentsRepository.findOne({
      //
      where: { id: rentId },
      relations: ['rentLocation', 'rentTags'],
    });
  }

  async create({
    createRentInput,
    imageUrl,
  }: IRentsServiceCreate): Promise<Rent> {
    const { rentLocation, rentTags, ...rent } = createRentInput;

    const result = await this.rentsLocationsRepository.save({
      ...rentLocation,
    });

    const temp = [];
    for (let i = 0; i < rentTags.length; i++) {
      const tagname = rentTags[i].replace('#', '');

      const prevTag = await this.rentsTagsRepository.findOne({
        where: { name: tagname },
      });

      if (prevTag) {
        temp.push(prevTag);
      } else {
        const newTag = await this.rentsTagsRepository.save({
          name: tagname,
        });
        temp.push(newTag);
      }
    }

    const result2 = await this.rentsRepository.save({
      ...rent,
      rentLocation: result,
      // rentCategory: {
      //   id: rentCategoryId,
      // },
      rentTags: temp,
    });

    for (let i = 0; i < imageUrl.length; i++) {
      await this.rentImageRepository.save({
        image: imageUrl[i],
        rent: { ...result2 },
      });
    }

    return result2;
  }

  async update({ rentId, updateRentInput, imageUrl }) {
    const newImage = await this.rentImageRepository.find({
      relations: ['rent'],
      where: { rent: { id: rentId } },
    });
    if (newImage) {
      for (let i = 0; i < newImage.length; i++) {
        await this.rentImageRepository.delete(newImage[i].id);
      }
    }
    //   await Promise.all(
    //     forDelete.map(async (el) => {
    //         return await this.carImgRepository.delete({
    //             carCustom,
    //             imgURL: el,
    //         });
    //     }),
    // );
    const rents = await this.rentsRepository.findOne({
      where: {
        id: rentId,
      },
    });
    for (let i = 0; i < imageUrl.length; i++) {
      await this.rentImageRepository.save({
        image: imageUrl[i],
        rent: { ...rents },
      });
    }
    const newrents = {
      ...rents,
      ...updateRentInput,
    };
    return this.rentsRepository.save(newrents);
  }

  async delete({ rentId }) {
    const result = await this.rentsRepository.softDelete({ id: rentId });
    return result.affected ? true : false;
  }

  async restore({ rentId }) {
    const result = await this.rentsRepository.restore({ id: rentId });
    return result.affected ? true : false;
  }
}

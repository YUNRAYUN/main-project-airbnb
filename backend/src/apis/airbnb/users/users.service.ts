import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceFindOne,
} from './interfaces/users-service.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // 전체 유저 조회
  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      withDeleted: true,
    });
  }

  // 이메일로 유저 조회
  findOne({ email }: IUsersServiceFindOne): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      withDeleted: true,
    });
  }
  // 로그인한 유저 한사람 조회
  findLoginOne({ context }): Promise<User> {
    return this.usersRepository.findOne({
      where: { email: context.req.user.email },
    });
  }

  // 유저 생성
  async create({
    email,
    hashedPassword: password,
    name,
    age,
  }: IUsersServiceCreate): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');

    return this.usersRepository.save({ email, password, name, age });
  }

  // 유저정보 업데이트
  async update({ email, hashedPassword: password, name, age, user }) {
    const newUsers = {
      ...user,
      email,
      password,
      age,
      name,
    };
    return await this.usersRepository.save(newUsers);
  }

  // 로그인한 유저 비밀번호 업데이트
  async updateUserPwd({ hashedPassword: password, user }) {
    const newPassword = {
      ...user,

      password,
    };
    return await this.usersRepository.save(newPassword);
  }

  // 유저정보 삭제
  async delete({ email }) {
    const result = await this.usersRepository.softDelete({ email });
    return result.affected ? true : false;
  }
  // 로그인한 유저 삭제
  async deleteLoginUser({ context }) {
    const result = await this.usersRepository.softDelete({
      email: context.req.user.email,
    });
    return result.affected ? true : false;
  }

  // 유저정보 복구
  async restore({ email }) {
    const result = await this.usersRepository.restore({
      email,
    });
    return result.affected ? true : false;
  }
}

import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { IContext } from 'src/commons/types/context';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  // 유저정보 생성
  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args({ name: 'age', type: () => Int }) age: number,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({ email, hashedPassword, name, age });
  }

  // 이메일로 유저 조회

  @Query(() => User)
  async fetchUser(
    @Context() context: IContext, //
    @Args('email') email: string, //
  ) {
    console.log('=================');
    console.log(context.req.user);
    console.log('=================');
    return this.usersService.findOne({ email });
  }

  // 로그인한 유저 한사람 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchLoginUser(
    @Context() context, //
  ) {
    return this.usersService.findLoginOne({ context });
  }

  // 전체 유저 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  // 유저정보 업데이트
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args({ name: 'age', type: () => Int }) age: number,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.findOne({ email });
    return this.usersService.update({ email, hashedPassword, name, age, user });
  }

  // 로그인한 user의 비밀번호 변경
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUserPwd(
    @Context() context: IContext,
    @Args('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.findOne({
      email: context.req.user.email,
    });
    return this.usersService.updateUserPwd({ hashedPassword, user });
  }

  // 유저정보 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteUser(
    @Args('email') email: string, //
  ): Promise<boolean> {
    return this.usersService.delete({ email });
  }

  // 로그인한 유저 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteLoginUser(
    @Context() context: IContext, //
  ) {
    return this.usersService.deleteLoginUser({ context });
  }

  // 유저정보 복구
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async restoreUser(
    @Args('email') email: string, //
  ): Promise<boolean> {
    return this.usersService.restore({ email });
  }
}

import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../airbnb/users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { IContext } from 'src/commons/types/context';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth-guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService, //
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    // 로그인
    const user = await this.usersService.findOne({ email });

    // 일치하는 유저가 없으면 에러
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다');

    // 일치하는 유저가 있지만, 비밀번호가 틀리면 에러
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // refreshToken 만들어서 프엔 쿠키에 저장해서 보내주기
    this.authService.setRefreshToken({ user, res: context.res });

    // 일치하는 유저가 있으면 accessToken 전달
    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ): string {
    return this.authService.getAccessToken({ user: context.req.user });
  }

  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => String)
  // async logout(
  //   //
  //   @Context() context: IContext,
  // ) {
  //   return this.authService.logout({
  //     req: context.req,
  //     res: context.res,
  //   });
  // }
}

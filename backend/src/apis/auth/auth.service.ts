import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceSetRefreshToken,
} from './interface/auth-service.interface';
import { UsersService } from '../airbnb/users/users.service';
import { IContext } from 'src/commons/types/context';
import { Cache } from 'cache-manager';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //

    private readonly usersService: UsersService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  setRefreshToken({ user, res }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
    );

    // 개발환경
    // @ts-ignore
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1w' },
    );
  }

  async mySocialLogin({ req, res }) {
    // 1. 회원 조회
    let user = await this.usersService.findOne({ email: req.user.email });
    // 2.  회원가입이 안돼있다면?  자동회원가입
    if (!user) user = await this.usersService.create({ ...req.user });
    // 3. 회원가입이 돼있다면?  로그인(refreshToken, accessToken 만들어서 브라우저에 전송)
    this.setRefreshToken({ user, res });
    res.redirect(
      'http://localhost:5501/main-project/frontend/login/index.html',
    );
  }

  // async logout({ req, res }: IContext) {
  //   const accessToken = req.headers.authorization.replace('Bearer ', '');
  //   const refreshToken = req.headers.cookie.replace('refreshToken=', '');

  //   const verifiedAccess = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
  //   const verifiedRefresh = jwt.verify(
  //     refreshToken,
  //     process.env.JWT_FRESH_KEY, //
  //   );

  //   const current = new Date().getTime();
  //   const ttlOfAccess = Math.trunc(
  //     (verifiedAccess['exp'] * 1000 - current) / 1000,
  //   );

  //   const ttlOfRefresh = Math.trunc(
  //     (verifiedRefresh['exp'] * 1000 - current) / 1000,
  //   );
  //   try {
  //     verifiedAccess;
  //     await this.cacheManager.set(
  //       // 캐시매니저에 저장
  //       `accessToken = ${accessToken}`,
  //       'accessToken',
  //       { ttl: ttlOfAccess },
  //     );

  //     verifiedRefresh;
  //     await this.cacheManager.set(
  //       // 캐시매니저 저장
  //       `refreshToken = ${refreshToken}`,
  //       'refreshToken',
  //       { ttl: ttlOfRefresh },
  //     );
  //   } catch (error) {
  //     throw new UnprocessableEntityException(error);
  //   }

  //   res.setHeader('Set-Cookie', `refreshToken=; path=/; Secure; httpOnly;`);

  //   return '로그아웃 성공';
  // }
}

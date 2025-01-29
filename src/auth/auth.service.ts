import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/users/entities/user.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * 기능
   * 1) registerWithEmail
   *  - email, nickname, password를 입력받고, 사용자를 생성한다.
   *  - 생성이 완료되면 accessToken과 refreshToken을 반환한다.
   *    '회원가입 후 다시 로그인해주세요'와 같은 과정을 스킵하고, 로그인처리 하기 위해서
   *
   * 2) loginwithEmail
   *  - email, password를 입력하면 사용자 검증을 진행한다.
   *  - 검증이 완료되면 accessToken과 refreshToken을 반환한다.
   *
   * 3) loginUser
   *  - (1)과 (2)에서 필요한 accessToken과 RefreshToken을 반환하는 로직
   *
   * 4) signToken
   *  - (3)에서 필요한 accessToken과 refreshToken을 sign(생성)하는 로직
   *
   * 5) authenticateWithEmailAndPassword
   *  - (2)에서 로그인을 진행할 때 필요한 기본적인 검증 진행
   *    1. 사용자가 존재하는지 확인(email)
   *    2. 비밀번호가 맞는지 확인
   *    3. 모두 통과되면 찾은 사용자 정보 반환
   *    4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   */

  /**
   * Payload
   * @props email
   * @props sub => id
   * @props type => 'access' | 'refresh
   */
  signToken(user: Pick<UserModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      // seconds
      expiresIn: isRefreshToken ? 60 * 60 : 60 * 5,
    });
  }

  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UserModel, 'email' | 'password'>,
  ) {
    const existedUser = await this.usersService.getUserByEmail(user.email);

    if (!existedUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    /**
     * @param password 입력된 비밀번호
     * @param hash 기존해시 => 사용자 정보에 입력되어 있는 해싱된 비밀번호
     */
    const isPasswordOk = await bcrypt.compare(
      user.password,
      existedUser.password,
    );

    if (!isPasswordOk) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return existedUser;
  }

  async loginWithEmail(user: Pick<UserModel, 'email' | 'password'>) {
    const authenticatedUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(authenticatedUser);
  }

  async registerWithEmail(
    user: Pick<UserModel, 'email' | 'nickname' | 'password'>,
  ) {
    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);
    const createdUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(createdUser);
  }
}

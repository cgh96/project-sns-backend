import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async createUser(user: Pick<UserModel, 'email' | 'password' | 'nickname'>) {
    const { nickname, email, password } = user;

    const isNickNameExisted = await this.usersRepository.exists({
      where: {
        nickname,
      },
    });

    if (isNickNameExisted) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const isEmailExisted = await this.usersRepository.exists({
      where: {
        email,
      },
    });

    if (isEmailExisted) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    const createdUser = this.usersRepository.create({
      nickname,
      email,
      password,
    });

    const newUser = await this.usersRepository.save(createdUser);

    return newUser;
  }
}

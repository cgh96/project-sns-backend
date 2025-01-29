import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { UserModel } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({
      // 데이터베이스 타입
      type: 'postgres',
      host: process.env.HOST,
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [PostModel, UserModel],
      // Nestjs에서 작성하는 TypeOrm코드와 DB의 싱크를 자동으로 맞출 것인지에 대한 여부 (DEV에서만 true)
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

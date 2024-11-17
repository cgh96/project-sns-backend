import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      entities: [],
      // Nestjs에서 작성하는 TypeOrm코드와 DB의 싱크를 자동으로 맞출 것인지에 대한 여부 (DEV에서만 true)
      synchronize: process.env.DB_TYPEORM_SYNC === 'true',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

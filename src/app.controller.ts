import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface IPost {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/post')
  getPost(): IPost {
    return {
      author: 'newjeans_ofiicial',
      title: '뉴진스 민지',
      content: '민지가 민지',
      likeCount: 100000,
      commentCount: 33333,
    };
  }
}

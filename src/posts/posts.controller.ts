import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

const posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '메이크업 고치는 민지',
    likeCount: 11111,
    commentCount: 123124,
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 해린',
    content: '노래연습하는 해린',
    likeCount: 111,
    commentCount: 13124,
  },
  {
    id: 3,
    author: 'blackpink_official',
    title: '블랙핑크 로제',
    content: '춤추는 로제',
    likeCount: 1131,
    commentCount: 131124,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * @method GET /posts
   * @description 모든 posts를 다 가져온다.
   */
  @Get()
  getPosts(): PostModel[] {
    return posts;
  }

  /**
   * @method GET /posts/:id
   * @description id에 해당되는 post를 가져온다.
   */
  @Get(':id')
  getPost(@Param('id') id: string) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  /**
   * @method POST /posts
   * @description post를 생성한다.
   */
  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    if (!author || !title || !content) {
      throw new BadRequestException();
    }

    const post: PostModel = {
      id: posts.length + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    posts.push(post);

    return post;
  }
}

import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
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
   *  모든 posts를 다 가져온다.
   */
  @Get()
  getPosts(): PostModel[] {
    return posts;
  }

  /**
   * @method GET /posts/:id
   * id에 해당되는 post를 가져온다.
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
   * 3) POST /posts
   * post를 생성한다.
   */
}

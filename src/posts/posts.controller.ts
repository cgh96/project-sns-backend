import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
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

let posts: PostModel[] = [
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

    if (!post) throw new NotFoundException();

    return post;
  }

  /**
   * @method POST /posts
   * @description post를 생성한다.
   */
  @Post()
  postPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    if (!author || !title || !content) throw new BadRequestException();

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

  /**
   * @method PATCH /posts/:id
   * @description id에 해당되는 Posts를 변경한다.
   */
  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    const target = posts.find((post) => post.id === +id);

    if (!target) throw new NotFoundException();

    if (author) {
      target.author = author;
    }

    if (title) {
      target.title = title;
    }

    if (content) {
      target.content = content;
    }

    return target;
  }

  /**
   * @method DELETE /post/:id
   */

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    const deleteTarget = posts.find((post) => post.id === +id);

    if (!deleteTarget) throw new NotFoundException();

    posts = posts.filter((post) => post.id !== +id);

    return id;
  }
}

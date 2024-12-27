import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostModel } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * @method GET /posts
   * @description 모든 posts를 다 가져온다.
   */
  @Get()
  getPosts(): Promise<PostModel[]> {
    return this.postsService.getAllPosts();
  }

  /**
   * @method GET /posts/:id
   * @description id에 해당되는 post를 가져온다.
   */
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }

  /**
   * @method POST /posts
   * @description post를 생성한다.
   */
  @Post()
  postPost(
    @Body('authorId') authorID: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(authorID, title, content);
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
    return this.postsService.updatePost(+id, author, title, content);
  }

  /**
   * @method DELETE /post/:id
   */

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.removePost(+id);
  }
}

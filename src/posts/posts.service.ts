import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  async getPostById(id: number) {
    return this.postsRepository.find({
      where: {
        id,
      },
      relations: ['author'],
    });
  }

  async createPost(authorID: number, title: string, content: string) {
    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> create 메서드에서 생성한 객체를 저장한다.

    if (!authorID || !title || !content) throw new BadRequestException();

    const post = this.postsRepository.create({
      author: {
        id: authorID,
      },
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(id: number, author: string, title: string, content: string) {
    // save의 기능
    // 1) id (primary key)가 없는 데이터의 경우 : 데이터 생성
    // 2) id (primary key)가 있는 데이터의 경우 : 해당 데이터를 업데이트

    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) throw new NotFoundException();

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async removePost(id: number) {
    const removedTarget = this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!removedTarget) throw new NotFoundException();

    await this.postsRepository.delete(id);

    return id;
  }
}

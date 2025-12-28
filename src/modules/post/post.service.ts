import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async create(userId: string, dto: CreatePostDto) {
    const post = this.postRepo.create({
      userId,
      content: dto.content,
      imageUrl: dto.imageUrl || null,
    });

    return await this.postRepo.save(post);
  }

  async findAll() {
    return this.postRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, userId: string, dto: UpdatePostDto) {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');

    if (post.userId !== userId)
      throw new NotFoundException('You cannot edit this post');

    Object.assign(post, dto);
    return await this.postRepo.save(post);
  }

  async remove(id: string, userId: string) {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');

    if (post.userId !== userId)
      throw new NotFoundException('You cannot delete this post');

    await this.postRepo.remove(post);
    return { message: 'Post deleted' };
  }
}

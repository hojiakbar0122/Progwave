import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}

  async create(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentRepo.create({
      text: dto.text,
      postId,
      userId,
    });

    await this.commentRepo.save(comment);

    // Yaratilgandan keyin user/password chiqib ketmasin deb “safe select” bilan qaytaramiz
    return this.getOne(comment.id);
  }

  async listByPost(postId: string) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    return this.commentRepo
      .createQueryBuilder('c')
      .leftJoin('c.user', 'u')
      .addSelect(['u.id', 'u.firstName', 'u.lastName', 'u.nickname', 'u.avatarId'])
      .leftJoin('u.avatar', 'av')
      .addSelect(['av.id', 'av.path', 'av.mimetype', 'av.size', 'av.name', 'av.model'])
      .where('c.postId = :postId', { postId })
      .orderBy('c.createdAt', 'DESC')
      .getMany();
  }

  async getOne(commentId: string) {
    const comment = await this.commentRepo
      .createQueryBuilder('c')
      .leftJoin('c.user', 'u')
      .addSelect(['u.id', 'u.firstName', 'u.lastName', 'u.nickname', 'u.avatarId'])
      .leftJoin('u.avatar', 'av')
      .addSelect(['av.id', 'av.path', 'av.mimetype', 'av.size', 'av.name', 'av.model'])
      .where('c.id = :commentId', { commentId })
      .getOne();

    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }



  async update(commentId: string, userId: string, dto: UpdateCommentDto) {
    const existing = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!existing) throw new NotFoundException('Comment not found');

    if (existing.userId !== userId) {
      throw new ForbiddenException('Siz faqat o‘zingizning commentingizni tahrir qila olasiz');
    }

    if (dto.text !== undefined) existing.text = dto.text;

    await this.commentRepo.save(existing);
    return this.getOne(existing.id);
  }

  async remove(commentId: string, userId: string) {
    const existing = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!existing) throw new NotFoundException('Comment not found');

    if (existing.userId !== userId) {
      throw new ForbiddenException('Siz faqat o‘zingizning commentingizni o‘chira olasiz');
    }

    await this.commentRepo.delete({ id: commentId });
    return { success: true };
  }
}

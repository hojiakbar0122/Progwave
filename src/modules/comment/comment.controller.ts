import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post as HttpPost,
  Req,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(AuthGuard('access_token_user'))
@Controller('posts')
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  // ✅ POST /posts/:id/comments
  @HttpPost(':id/comments')
  @ApiOperation({ summary: 'Postga comment yozish' })
  @ApiParam({ name: 'id', type: String, description: 'Post ID (UUID)' })
  @ApiResponse({ status: 201, description: 'Comment yaratildi' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  create(
    @Param('id', ParseUUIDPipe) postId: string,
    @Req() req: any,
    @Body() dto: CreateCommentDto,
  ) {
    return this.service.create(postId, req.user.id, dto);
  }

  // ✅ GET /posts/:id/comments
  @Get(':id/comments')
  @ApiOperation({ summary: 'Post commentlarini olish' })
  @ApiParam({ name: 'id', type: String, description: 'Post ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Comments ro‘yxati' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  list(@Param('id', ParseUUIDPipe) postId: string) {
    return this.service.listByPost(postId);
  }

  // --- ixtiyoriy (kerak bo'lsa ishlataverasan) ---

  // PATCH /posts/:id/comments/:commentId (post context bilan)
  @Patch(':id/comments/:commentId')
  @ApiOperation({ summary: 'Commentni tahrirlash (faqat egasi)' })
  @ApiParam({ name: 'id', type: String, description: 'Post ID (UUID)' })
  @ApiParam({ name: 'commentId', type: String, description: 'Comment ID (UUID)' })
  update(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Req() req: any,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.service.update(commentId, req.user.id, dto);
  }

  // DELETE /posts/:id/comments/:commentId
  @Delete(':id/comments/:commentId')
  @ApiOperation({ summary: 'Commentni o‘chirish (faqat egasi)' })
  @ApiParam({ name: 'id', type: String, description: 'Post ID (UUID)' })
  @ApiParam({ name: 'commentId', type: String, description: 'Comment ID (UUID)' })
  remove(@Param('commentId', ParseUUIDPipe) commentId: string, @Req() req: any) {
    return this.service.remove(commentId, req.user.id);
  }
}

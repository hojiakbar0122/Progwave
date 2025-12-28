import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PostsService } from './post.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ACCESS_TOKEN_USER } from '../auth/passport-stratagies/access-token-user/access-token-user.strategy';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Post()
  @ApiOperation({ summary: 'Yangi post yaratish' })
  @ApiResponse({ status: 201, description: 'Post yaratildi' })
  create(@Req() req: any, @Body() dto: CreatePostDto) {
    return this.postsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha postlarni olish' })
  @ApiResponse({ status: 200, description: 'Postlar ro‘yxati' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta postni olish' })
  @ApiParam({ name: 'id', type: String, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post topildi' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Patch(':id')
  @ApiOperation({ summary: 'Postni yangilash (faqat o‘z posti)' })
  @ApiParam({ name: 'id', type: String, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post yangilandi' })
  update(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, req.user.id, dto);
  }

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Delete(':id')
  @ApiOperation({ summary: 'Postni o‘chirish (faqat o‘z posti)' })
  @ApiParam({ name: 'id', type: String, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post o‘chirildi' })
  remove(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.remove(id, req.user.id);
  }
}

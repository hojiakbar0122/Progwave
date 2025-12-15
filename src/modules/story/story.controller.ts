import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ACCESS_TOKEN_USER } from '../auth/passport-stratagies/access-token-user/access-token-user.strategy';

@ApiTags('Stories')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('stories')
export class StoryController {
  constructor(private readonly service: StoryService) {}

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Post()
  @ApiOperation({ summary: 'Yangi story yaratish' })
  @ApiResponse({ status: 201, description: 'Story yaratildi' })
  create(@Req() req: any, @Body() dto: CreateStoryDto) {
    return this.service.create(req.user.id, dto);
  }

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Get('me')
  @ApiOperation({ summary: 'O‘z storylarini olish' })
  @ApiResponse({ status: 200, description: 'Storylar ro‘yxati' })
  getMyStories(@Req() req: any) {
    return this.service.getUserStories(req.user.id);
  }

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Post('view/:storyId')
  @ApiOperation({ summary: 'Story ko‘rildi deb belgilash' })
  @ApiParam({ name: 'storyId', type: Number, description: 'Story ID' })
  viewStory(@Req() req: any, @Param('storyId', ParseIntPipe) storyId: number) {
    return this.service.viewStory(storyId, req.user.id);
  }

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Get('views/:storyId')
  @ApiOperation({ summary: 'Story kimlar tomonidan ko‘rilganini olish' })
  @ApiParam({ name: 'storyId', type: Number, description: 'Story ID' })
  getViews(@Param('storyId', ParseIntPipe) storyId: number) {
    return this.service.getViews(storyId);
  }
}

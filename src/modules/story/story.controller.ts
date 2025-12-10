import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { StoryService } from "./story.service";
import { CreateStoryDto } from "./dto/create-story.dto";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("stories")
@UseGuards(RolesGuard)
export class StoryController {
  constructor(private readonly service: StoryService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateStoryDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get("user/:id")
  getUserStories(@Param("id", ParseIntPipe) id: number) {
    return this.service.getUserStories(id);
  }

  @Post("view/:storyId")
  viewStory(@Req() req, @Param("storyId", ParseIntPipe) storyId: number) {
    return this.service.viewStory(storyId, req.user.id);
  }

  @Get("views/:storyId")
  getViews(@Param("storyId", ParseIntPipe) storyId: number) {
    return this.service.getViews(storyId);
  }
}

import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import { StoryView } from './entities/story-view.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Story, StoryView])],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule {}

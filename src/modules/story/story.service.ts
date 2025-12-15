import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan, MoreThan } from "typeorm";
import { Story } from "./entities/story.entity";
import { StoryView } from "./entities/story-view.entity";
import { CreateStoryDto } from "./dto/create-story.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private storyRepo: Repository<Story>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(StoryView)
    private viewRepo: Repository<StoryView>,
  ) {}

  async create(userId: number, dto: CreateStoryDto) {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException("User not found");

  const story = this.storyRepo.create({
    userId,
    mediaUrl: dto.mediaUrl,
    mediaType: dto.mediaType ?? "image",
    expiresAt: new Date(Date.now() + 86400000),
  });

  return this.storyRepo.save(story);
}


  async getUserStories(userId: number) {
    return this.storyRepo.find({
      where: { userId, expiresAt: MoreThan(new Date()) },
      order: { createdAt: "DESC" },
    });
  }

  async viewStory(storyId: number, viewerId: number) {
    const story = await this.storyRepo.findOne({ where: { id: storyId } });
    if (!story) throw new NotFoundException("Story not found");

    const existing = await this.viewRepo.findOne({
      where: { storyId, userId: viewerId },
    });

    if (!existing) {
      const view = this.viewRepo.create({ storyId, userId: viewerId });
      await this.viewRepo.save(view);
    }

    return { viewed: true };
  }

  async getViews(storyId: number) {
    return this.viewRepo.find({
      where: { storyId },
      relations: ["user"],
      order: { viewedAt: "DESC" },
    });
  }

  async cleanExpiredStories() {
    await this.storyRepo.delete({ expiresAt: LessThan(new Date()) });
  }
}

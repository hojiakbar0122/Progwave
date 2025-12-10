import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Profile } from "./entities/profile.entity";
import { User } from "../users/entities/user.entity";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException("User not found");

    const existing = await this.repo.findOne({ where: { user: { id: dto.userId } } });
    if (existing) return existing;

    const profile = this.repo.create({ user });
    return this.repo.save(profile);
  }

  async findOne(userId: number) {
    const profile = await this.repo.findOne({ where: { user: { id: userId } } });
    if (!profile) throw new NotFoundException("Profile not found");
    return profile;
  }

  async update(userId: number, dto: UpdateProfileDto) {
    const profile = await this.repo.findOne({ where: { user: { id: userId } } });
    if (!profile) throw new NotFoundException("Profile not found");

    Object.assign(profile, dto);
    return this.repo.save(profile);
  }

  async remove(userId: number) {
    const profile = await this.repo.findOne({ where: { user: { id: userId } } });
    if (!profile) throw new NotFoundException("Profile not found");

    await this.repo.remove(profile);
    return { message: "Profile deleted" };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Profile } from './entities/profile.entity';
import { User } from '../users/entities/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 🔹 Profile yaratish (faqat token userId bilan)
  async create(userId: number, dto: CreateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.repo.findOne({ where: { user: { id: userId } } });
    if (existing) return existing;

    const profile = this.repo.create({
      user,
      fullName: dto.fullName,
      bio: dto.bio,
      website: dto.website,
      avatarUrl: dto.avatarUrl,
      coverImageUrl: dto.coverImageUrl,
      gender: dto.gender,
      birthday: dto.birthday,
      skills: dto.skills || [],
    });

    return this.repo.save(profile);
  }

  // 🔹 O‘z profilini olish
  async findOne(userId: number) {
    const profile = await this.repo.findOne({ where: { user: { id: userId } } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  // 🔹 Barcha profillar (faqat admin/razdel uchun)
  async findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  // 🔹 O‘z profilini yangilash
  async update(userId: number, dto: UpdateProfileDto) {
    const profile = await this.repo.findOne({ where: { user: { id: userId } } });
    if (!profile) throw new NotFoundException('Profile not found');

    Object.assign(profile, dto);
    return this.repo.save(profile);
  }

  // 🔹 O‘z profilini o‘chirish
  async remove(userId: number) {
    const profile = await this.repo.findOne({ where: { user: { id: userId } } });
    if (!profile) throw new NotFoundException('Profile not found');

    await this.repo.remove(profile);
    return { message: 'Profile deleted' };
  }
}

import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("profiles")
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.service.create(dto);
  }

  @Get(":userId")
  findOne(@Param("userId", ParseIntPipe) userId: number) {
    return this.service.findOne(userId);
  }

  @Patch(":userId")
  update(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.service.update(userId, dto);
  }

  @Delete(":userId")
  remove(@Param("userId", ParseIntPipe) userId: number) {
    return this.service.remove(userId);
  }
}

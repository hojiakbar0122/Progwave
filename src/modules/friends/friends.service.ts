import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FriendRequest } from '../friend-requests/entities/friend-request.entity';
import { Friend } from './entities/friend.entity';
import { User } from '../users/entities/user.entity';
import { FriendsGateway } from './friends.gateway';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepo: Repository<FriendRequest>,

    @InjectRepository(Friend)
    private friendRepo: Repository<Friend>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private dataSource: DataSource,

    @Inject(forwardRef(() => FriendsGateway))
    private gateway: FriendsGateway,
  ) {}

  // ============================================================
  // SEND FRIEND REQUEST
  // ============================================================
  async sendRequest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId)
      throw new BadRequestException('You cannot add yourself.');

    const toUser = await this.userRepo.findOne({ where: { id: toUserId } });
    if (!toUser) throw new NotFoundException('User not found');

    // 1) Check if already friends
    const alreadyFriends = await this.friendRepo.findOne({
      where: [
        { userId: fromUserId, friendId: toUserId },
        { userId: toUserId, friendId: fromUserId },
      ],
    });

    if (alreadyFriends)
      throw new BadRequestException('You are already friends.');

    // 2) Check existing pending request in both directions
    const existing = await this.friendRequestRepo.findOne({
      where: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existing && existing.status === 'pending')
      throw new BadRequestException('Request already pending.');

    // 3) Create request
    let req = this.friendRequestRepo.create({
      fromUserId,
      toUserId,
      status: 'pending',
    });

    req = await this.friendRequestRepo.save(req); // <-- id hosil bo'ladi!

    // 4) SOCKET EVENT
    await this.gateway.emitFriendRequest(toUserId, {
      requestId: req.id,
      fromUserId,
    });

    return req;
  }

  // ============================================================
  // ACCEPT REQUEST
  // ============================================================
  async acceptRequest(requestId: string, userId: string) {
    const request = await this.friendRequestRepo.findOne({
      where: { id: requestId },
    });

    if (!request) throw new NotFoundException('Request not found');

    if (request.toUserId !== userId)
      throw new BadRequestException('This request is not for you');

    if (request.status !== 'pending')
      throw new BadRequestException('Request already processed');

    // Transaction: add two friend rows + update request
    const acceptedReq = await this.dataSource.transaction(async (manager) => {
      // 1) Update status
      request.status = 'accepted';
      await manager.save(request);

      // 2) Create two friend rows
      await manager.save(
        manager.create(Friend, {
          userId: request.fromUserId,
          friendId: request.toUserId,
        }),
      );

      await manager.save(
        manager.create(Friend, {
          userId: request.toUserId,
          friendId: request.fromUserId,
        }),
      );

      return request;
    });

    // 3) SOCKET EVENT — TO‘G‘RI joyi
    await this.gateway.emitFriendAccept(acceptedReq.fromUserId, {
      requestId: acceptedReq.id,
      acceptedBy: userId,
    });

    return acceptedReq;
  }

  // ============================================================
  // REJECT REQUEST
  // ============================================================
  async rejectRequest(requestId: string, userId: string) {
    const request = await this.friendRequestRepo.findOne({
      where: { id: requestId },
    });

    if (!request) throw new NotFoundException('Request not found');

    if (request.toUserId !== userId)
      throw new BadRequestException('This request is not for you');

    if (request.status !== 'pending')
      throw new BadRequestException('Request already processed');

    request.status = 'rejected';
    return this.friendRequestRepo.save(request);
  }

  // ============================================================
  // CANCEL REQUEST (sender cancels)
  // ============================================================
  async cancelRequest(requestId: string, userId: string) {
    const request = await this.friendRequestRepo.findOne({
      where: { id: requestId },
    });

    if (!request) throw new NotFoundException('Request not found');

    if (request.fromUserId !== userId)
      throw new BadRequestException('You cannot cancel this');

    if (request.status !== 'pending')
      throw new BadRequestException('Request already processed');

    request.status = 'cancelled';
    return this.friendRequestRepo.save(request);
  }

  // ============================================================
  // FRIEND LIST
  // ============================================================
  async getFriends(userId: string) {
    return this.friendRepo.find({
      where: { userId },
      relations: ['friend'],
    });
  }

  // ============================================================
  // PENDING REQUESTS (received)
  // ============================================================
  async getPendingRequests(userId: string) {
    return this.friendRequestRepo.find({
      where: { toUserId: userId, status: 'pending' },
      relations: ['fromUser'],
    });
  }
}

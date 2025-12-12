import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { Inject, forwardRef } from "@nestjs/common";
import { FriendsService } from "./friends.service";

@WebSocketGateway({
  cors: { origin: "*" },
})
export class FriendsGateway {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<number, string>(); // userId -> socketId

  constructor(
    @Inject(forwardRef(() => FriendsService))
    private readonly friendsService: FriendsService
  ) {}

  // When user connects
  handleConnection(client) {
    const userId = Number(client.handshake.query.userId);
    this.onlineUsers.set(userId, client.id);

    this.notifyFriendsOnline(userId);
  }

  handleDisconnect(client) {
    const userId = [...this.onlineUsers].find(
      ([_, sid]) => sid === client.id
    )?.[0];

    if (userId) {
      this.onlineUsers.delete(userId);
      this.notifyFriendsOffline(userId);
    }
  }

  // ====================================================
  // Notify user's friends that he is online
  // ====================================================
  private async notifyFriendsOnline(userId: number) {
    const friends = await this.friendsService.getFriends(userId);

    friends.forEach((f) => {
      const socketId = this.onlineUsers.get(f.friendId);
      if (socketId) {
        this.server.to(socketId).emit("friend_online", { userId });
      }
    });
  }

  // ====================================================
  // Notify user's friends that he is offline
  // ====================================================
  private async notifyFriendsOffline(userId: number) {
    const friends = await this.friendsService.getFriends(userId);

    friends.forEach((f) => {
      const socketId = this.onlineUsers.get(f.friendId);
      if (socketId) {
        this.server.to(socketId).emit("friend_offline", { userId });
      }
    });
  }

  // ====================================================
  // SEND REQUEST EVENT (real-time)
  // ====================================================
  async emitFriendRequest(toUserId: number, data: any) {
    const socketId = this.onlineUsers.get(toUserId);
    if (!socketId) return;

    this.server.to(socketId).emit("friend_request", data);
  }

  // ====================================================
  // ACCEPT REQUEST EVENT
  // ====================================================
  async emitFriendAccept(toUserId: number, data: any) {
    const socketId = this.onlineUsers.get(toUserId);
    if (!socketId) return;

    this.server.to(socketId).emit("friend_accepted", data);
  }
}

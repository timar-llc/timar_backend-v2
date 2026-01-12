import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WebSocketService implements OnModuleInit {
  private readonly logger = new Logger(WebSocketService.name);
  private server: Server | null = null;

  onModuleInit() {
    this.logger.log('WebSocketService initialized');
  }

  setServer(server: Server) {
    this.server = server;
    this.logger.log('WebSocket Server registered');
  }

  getServer(): Server {
    if (!this.server) {
      throw new Error(
        'WebSocket Server is not initialized. Make sure ChatGateway is loaded.',
      );
    }
    return this.server;
  }

  /**
   * Send event to specific user
   */
  emitToUser(userUuid: string, event: string, data: any) {
    const server = this.getServer();
    server.to(`user_${userUuid}`).emit(event, data);
    this.logger.debug(`Emitted ${event} to user ${userUuid}`);
  }

  /**
   * Send event to multiple users
   */
  emitToUsers(userUuids: string[], event: string, data: any) {
    const server = this.getServer();
    userUuids.forEach((userUuid) => {
      server.to(`user_${userUuid}`).emit(event, data);
    });
    this.logger.debug(`Emitted ${event} to ${userUuids.length} users`);
  }

  /**
   * Send event to all connected clients
   */
  emitToAll(event: string, data: any) {
    const server = this.getServer();
    server.emit(event, data);
    this.logger.debug(`Emitted ${event} to all clients`);
  }

  /**
   * Send notification event to user
   */
  emitNotification(userUuid: string, notification: any) {
    this.emitToUser(userUuid, 'notification', notification);
  }

  /**
   * Send user online status update
   */
  emitUserOnlineStatus(userUuid: string, isOnline: boolean, lastSeen?: Date) {
    this.emitToAll('user_online_status', {
      userUuid,
      isOnline,
      lastSeen: lastSeen?.toISOString(),
    });
  }
}

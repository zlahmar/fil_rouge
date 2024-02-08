// socket.adapter.ts

import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';

export class SocketAdapter extends IoAdapter {
  constructor(app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: socketio.ServerOptions): any {
    const server = super.createIOServer(port, options);

    // Configurations supplémentaires du serveur Socket.IO ici

    return server;
  }
}

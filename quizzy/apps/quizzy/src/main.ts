import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { SocketAdapter } from './app/modules/socket/socket.adapter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    allowedHeaders: ['Location', 'authorization', 'content-type'],
    exposedHeaders: ['Location'],
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  const globalUrl = `http://localhost:${port}/${globalPrefix}`;
}

bootstrap();

import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import FirebaseModule.forRoot({  googleApplicationCredential:    'apps/quizzy-back/src/assets/quizzy-firebase-key.json',})

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from 'nestjs-firebase';

@Module({
  imports: [
    FirebaseModule.forRoot({  
      googleApplicationCredential: 'apps/quizzy/src/assets/quizzy-12a74-firebase-adminsdk-vulpk-72962ed00c.json',
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

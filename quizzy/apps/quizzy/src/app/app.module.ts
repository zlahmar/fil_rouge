import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from 'nestjs-firebase';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential:
        'apps/quizzy/src/assets/quizzy-12a74-firebase-adminsdk-vulpk-38378d1f85.json'
    }),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}

import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from 'nestjs-firebase';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential:
        'apps/quizzy/src/assets/quizzy-firebase-key.json'
    }),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}

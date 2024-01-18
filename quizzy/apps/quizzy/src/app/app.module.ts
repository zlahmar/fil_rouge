import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from 'nestjs-firebase';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { QuizzModule } from './modules/quiz/quizz.module';
import { PingModule } from './modules/ping/ping.module';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential:
        '/Users/quentin/webservice_ynov/fil_rouge/quizzy/apps/quizzy/src/assets/quizzy-firebase-adminsdk.json',
    }),
    UsersModule,
    AuthModule,
    QuizzModule,
    PingModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}

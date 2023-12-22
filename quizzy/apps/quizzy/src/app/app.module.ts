import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from 'nestjs-firebase';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { QuizzModule } from './modules/quizz/quizz.module';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential:
        '../assets/quizzy-firebase-adminsdk.json',
    }),
    UsersModule,
    AuthModule,
    QuizzModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}

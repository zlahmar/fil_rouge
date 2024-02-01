import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from 'nestjs-firebase';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { PingModule } from './modules/ping/ping.module';
import { AuthMiddleware } from './modules/auth/auth.middleware';

@Module({
  imports: [
    FirebaseModule.forRoot({  
      googleApplicationCredential: 'apps/quizzy/src/assets/quizzy-firebase.json',
    }),
    UsersModule,
    AuthModule,
    QuizModule,
    PingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer){
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

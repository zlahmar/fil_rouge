import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from 'nestjs-firebase';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { PingModule } from './modules/ping/ping.module';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { SocketModule } from './modules/socket/socket.module';

@Module({
  imports: [
    FirebaseModule.forRoot({  
      googleApplicationCredential:'/Users/quentin/webservice_ynov/fil_rouge/quizzy/apps/quizzy/src/assets/quizzy-firebase-adminsdk.json',//'apps/quizzy/src/assets/quizzy-firebase.json',
    }),
    UsersModule,
    AuthModule,
    QuizModule,
    PingModule,
    SocketModule
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

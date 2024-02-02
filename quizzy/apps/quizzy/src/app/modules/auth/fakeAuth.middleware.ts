import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserDetails } from '../auth/model/user-details';

@Injectable()
export class FakeAuthMiddleware implements NestMiddleware {
  static currentUser: UserDetails | null = null;

  static SetUser(uid: string) {
    if (!uid) {
      FakeAuthMiddleware.currentUser = null;
      return;
    }
    FakeAuthMiddleware.currentUser = {
      uid,
      email: `${uid}@mail.com`,
    };
  }

  static Reset() {
    FakeAuthMiddleware.currentUser = null;
  }

  public async use(req: any, _: Response, next: NextFunction) {
    req.user = FakeAuthMiddleware.currentUser;
    next();
  }
}
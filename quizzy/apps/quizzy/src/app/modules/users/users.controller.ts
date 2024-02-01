import { Auth } from '../auth/auth.decorator';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RequestWithUser } from '../auth/model/request-with-user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {
  }

  @Auth()
  @Post()
  async createUser(@Body() newUser: object, @Req() request: RequestWithUser) {
    const uid = request.user.uid;
    const email = request.user.email;
    return await this.userService.createUser(newUser, uid, email);
  }

  @Get('/me')
  async getUser(@Req() request: RequestWithUser) {
    const uid = request.user.uid;
    return await this.userService.getUser(uid);
  }
}

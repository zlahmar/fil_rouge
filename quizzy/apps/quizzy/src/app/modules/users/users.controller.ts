import { Controller, Post, Get, Headers, HttpException, HttpStatus, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user_model';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() newUser: User, @Headers('authorization') authHeader: string) {
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    //console.log("Received from Frontend:", newUser);
    //return this.userService.createUser(newUser, token);
    if (!token) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.createUser(newUser, token);
  }

  @Get('/me')
  getUser(@Headers('authorization') authHeader: string) {
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.getUser(token);
  }
}

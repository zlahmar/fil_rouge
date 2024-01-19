import { Controller, Post, Get, Req, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
createUser(@Body() newUser,@Headers('authorization') authHeader: string) {
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
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

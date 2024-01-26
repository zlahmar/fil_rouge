import { Controller, Post, Get, Req, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../auth/auth.decorator';
import { RequestWithUser } from '../auth/model/request-with-user';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

@Auth()
@Post()

async createUser(@Body() newUser, @Req() request : RequestWithUser) {
    const uid = request.user.uid;
    const email = request.user.email;
    const resCreate = await this.userService.createUser(newUser, uid, email);
    return HttpStatus.CREATED; //status code 201
    // return resCreate;
  }

@Get('/me')
async getUser(@Req() request : RequestWithUser) {
    const uid = request.user.uid;
    const retour = await this.userService.getUser(uid);
    return retour;
  }
}

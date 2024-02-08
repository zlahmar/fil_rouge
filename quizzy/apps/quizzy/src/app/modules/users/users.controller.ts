import { Controller, Post, Get, Req, Body, Headers, HttpException, HttpStatus,Response } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../auth/auth.decorator';
import { RequestWithUser } from '../auth/model/request-with-user';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

@Auth()
@Post()

async createUser(@Body() newUser, @Req() request : RequestWithUser, @Response() res) {
    const uid = request.user.uid;
    const email = request.user.email;
    res.Body = await this.userService.createUser(newUser, uid, email);
    res.status = HttpStatus.CREATED;
    return res;
  }

@Get('/me')
async getUser(@Req() request : RequestWithUser) {
    const uid = request.user.uid;
    const retour = await this.userService.getUser(uid);
    return retour;
  }
}
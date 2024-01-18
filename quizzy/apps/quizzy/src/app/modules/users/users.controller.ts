import { Controller, Post, Get, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
createUser(@Body() newUSer) {
    // const uid = req.user.uid;
    return this.userService.createUser(newUSer);
  }

  @Get('/me')
getUser() {
    // const uid = req.user.uid;
    return this.userService.getUser();
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // This endpoint is just for testing purposes, if this was for a real application we would have a propper signup process
  @Post('create')
  async create(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<User> {
    return this.userService.create(username, password);
  }
}

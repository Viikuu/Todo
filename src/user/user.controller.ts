import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards
} from "@nestjs/common";
import { UserService } from './user.service';
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Request() request) {
    return this.userService.findOne(request.user._id);
  }
}

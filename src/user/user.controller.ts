import {
  Controller,
  Get,
  Param,
  Request,
  UnauthorizedException, UseGuards
} from "@nestjs/common";
import { UserService } from './user.service';
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() request, @Param('id') id: string) {
    if (id === request.user._id) {
      return this.userService.findOne(id);
    } else {
      throw new UnauthorizedException('Given id has to be the same as id of logged user!');
    }
  }
}

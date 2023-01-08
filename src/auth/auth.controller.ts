import { Body, Controller, Post, Request, Res, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./local/local-auth.guard";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorator";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any>{
    return {
      message: 'Account created successfully',
      payload: await this.authService.register(createUserDto),
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request, @Res({passthrough: true}) response): Promise<any>{
    return {
      message: 'User logged in successfully',
      payload: this.authService.login(response, request.user._doc)
    };
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() request, @Res({passthrough: true}) response): Promise<any>{
    await this.authService.logout(request, response);
    return {
      message: 'User logged out successfully',
    };
  }
}

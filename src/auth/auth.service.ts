import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findOneByUsername(username);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if(isPasswordValid) {
        const { password, email, ...userData } = user;
        return userData;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  login(response: any, user: any) {
    const payload = { username: user.username, sub: user._id};
    response.cookie('jwt', this.jwtService.sign(payload), {
      httpOnly: true
    });
    return payload;
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    const isEmailUsed = await this.userService.findOneByMail(createUserDto.email);
    if (isEmailUsed) {
      throw new BadRequestException('Account with given email is already created!');
    }
    const isUsernameUsed = await this.userService.findOneByUsername(createUserDto.username);
    if (isUsernameUsed) {
      throw new BadRequestException('Given username is already used!');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    try {
      const { username } = await this.userService.create({
        username : createUserDto.username,
        email : createUserDto.email,
        password : hashedPassword
      });
      return { username };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong while creating account, try again!');
    }
  }

  async logout(request: any, response: any) {
    if (request.cookies['jwt']) {
      response.clearCookie('jwt');
    }
  }
}

import { IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(4, 32)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 32)
  password: string;
}

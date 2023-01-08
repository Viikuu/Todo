import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel:Model<UserDocument>) { }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = await new this.userModel(createUserDto);
    return newUser.save();
  }

  async findOneByUsername(username: string): Promise<UserDocument> {
    try {
      const existingUser = await this.userModel
        .findOne({ username,
        })
        .exec();
      if (!existingUser) {
        return null;
      }
      return existingUser;
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong! Try again`);
    }
  }

  async findOneByMail(email: string): Promise<UserDocument> {
    try {
      const existingUser = await this.userModel
        .findOne({ email,
        })
        .exec();

      if (!existingUser) {
        return null;
      }
      return existingUser;
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong! Try again`);
    }
  }

  async findOne(id: string): Promise<User> {
    if (!id.match(/\w{24}/)){
      throw new BadRequestException('Invalid ID: The provided ID has to be 24digits long.')
    }
    try {
      const existingUser = await this.userModel
        .findById(id)
        .exec();
      return existingUser;
    } catch (error) {
      throw new NotFoundException(`User #${id} not found!`);
    }
  }
}

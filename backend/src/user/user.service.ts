import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findOne(username: string): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ username }).exec();
      if (!user) {
        throw new HttpException('User not found', 404);
      }
      return user;
    } catch (error) {
      throw new HttpException('User not found', 404);
    }
  }

  async create(username: string, password: string): Promise<User> {
    try {
      // Check if the user already exists
      const existingUser = await this.userModel.findOne({ username }).exec();
      if (existingUser) {
        throw new HttpException('User already exists', 400);
      }

      // Hash and salt the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = new this.userModel({
        username,
        password: hashedPassword,
      });
      return await newUser.save();
    } catch (error) {
      console.log(error);
      throw new HttpException('User not created', 400);
    }
  }
}

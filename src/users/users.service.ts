import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { User } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UsersService {
  async createUser(dto: CreateUserDto) {
    const user = new User();
    user.firstName = dto.firstName;
    user.lastName = dto.firstName;
    user.email = dto.email;
    user.password = dto.password;
    user.isActive = dto.isActive;
    return await user.save();
  }
  async getAllUser() {
    const allUsers = await User.find();
    return allUsers;
  }
}

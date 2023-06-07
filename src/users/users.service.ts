import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async create(dto: CreateUserDto) {
    const user = new User();
    user.fullName = dto.fullName;
    user.email = dto.email;
    user.password = dto.password;
    user.roles = dto.roles;
    return await user.save();
  }

  async findAll() {
    const allUsers = await User.find();
    return allUsers;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async create(dto: CreateUserDto) {
    const user = new User();
    user.email = dto.email;
    user.name = dto.name;
    user.lastname = dto.lastname;
    user.roleid = dto.role.id;

    // Save the user to the database
    return await user.save();
  }

  async findAll() {
    console.log('here');
    const allUsers = await User.find({ relations: ['role'] });
    return allUsers;
  }

  findOne(id: any) {
    return User.findOne({ where: { id }, relations: ['role'] });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.email = updateUserDto.email || user.email;
    user.name = updateUserDto.name || user.name;
    user.lastname = updateUserDto.lastname || user.lastname;

    user.roleid = updateUserDto.role.id || user.role.id;
    return await user.save();
  }

  async remove(id: number) {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Delete the user from the database
    await user.remove();
  }
}

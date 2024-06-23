// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | undefined> {
    return User.findOne({ where: { email } });
  }

  async create(dto: CreateUserDto) {
    const user = new User();
    user.email = dto.email;
    user.name = dto.name;
    user.lastname = dto.lastname;
    user.roleid = dto.role?.id;

    // Хешируем пароль перед сохранением
    user.password = await bcrypt.hash(dto.password, 10);

    // Сохраняем пользователя в базе данных
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

    user.roleid = updateUserDto.role?.id || user.role.id;

    // Обновляем пароль, если он был предоставлен
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return await user.save();
  }

  async remove(id: number) {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Удаляем пользователя из базы данных
    await user.remove();
  }
}

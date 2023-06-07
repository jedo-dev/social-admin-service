import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './users.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.UsersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Получить всех юзеров' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAl() {
    return this.UsersService.getAllUser();
  }
}

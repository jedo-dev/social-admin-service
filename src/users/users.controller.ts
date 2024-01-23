import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Пользователи')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiCreatedResponse({ description: 'Пользователь успешно создан.', type: UpdateUserDto })
  @ApiBadRequestResponse({ description: 'Неверные входные данные.' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает всех пользователей.',
    type: UpdateUserDto,
    isArray: true,
  })
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает пользователя с указанным ID.',
    type: UpdateUserDto,
  })
  @ApiNotFoundResponse({ description: 'Пользователь не найден.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить пользователя по ID' })
  @ApiCreatedResponse({ description: 'Пользователь успешно обновлен.', type: UpdateUserDto })
  @ApiNotFoundResponse({ description: 'Пользователь не найден.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiCreatedResponse({ description: 'Пользователь успешно удален.' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

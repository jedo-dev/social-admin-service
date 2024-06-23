import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Пользователи')
@ApiBearerAuth('JWT-auth') // Используйте название схемы из Swagger конфигурации
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @EventPattern('hello')
  async hello(data: string) {
    console.log(data, 'ff');
  }

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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить пользователя по ID' })
  @ApiCreatedResponse({ description: 'Пользователь успешно обновлен.', type: UpdateUserDto })
  @ApiNotFoundResponse({ description: 'Пользователь не найден.' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiCreatedResponse({ description: 'Пользователь успешно удален.' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден.' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь авторизован.' })
  @ApiBadRequestResponse({ description: 'Неверные входные данные.' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      return {
        statusCode: 400,
        message: 'Неверные учетные данные',
      };
    }
    return this.authService.login(user);
  }
}

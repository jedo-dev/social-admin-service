import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
@ApiTags('Роли')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Создать новую роль' })
  @ApiCreatedResponse({ description: 'Роль успешно создана.', type: CreateRoleDto })
  @ApiBadRequestResponse({ description: 'Неверные входные данные.' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Получить все роли' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает все роли.',
    type: CreateRoleDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Получить роль по ID' })
  @ApiResponse({ status: 200, description: 'Возвращает роль с указанным ID.', type: CreateRoleDto })
  @ApiNotFoundResponse({ description: 'Роль не найдена.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить роль по ID' })
  @ApiCreatedResponse({ description: 'Роль успешно обновлена.', type: CreateRoleDto })
  @ApiNotFoundResponse({ description: 'Роль не найдена.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Удалить роль по ID' })
  @ApiCreatedResponse({ description: 'Роль успешно удалена.' })
  @ApiNotFoundResponse({ description: 'Роль не найдена.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';

export class CreateUserDto {
  @ApiProperty({ example: 1, description: 'id записи' })
  readonly id?: number;
  @ApiProperty({ example: 'test@test.ru', description: 'Электронная почта' })
  readonly email: string;
  @ApiProperty({ example: '12345', description: 'Пароль' })
  readonly password: string; // Новое поле для пароля
  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  readonly lastname: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  readonly name: string;

  @ApiProperty({ example: CreateRoleDto, description: 'Роль' })
  readonly role?: CreateRoleDto;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.ru', description: 'почта' })
  readonly email: string;
  @ApiProperty({ example: 'ну тут букофки', description: 'Пароль' })
  readonly password: string;
  @ApiProperty({ example: '1', description: 'уникальный идентификатор' })
  readonly id: number;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  readonly firstName?: string;
  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  readonly lastName?: string;
  @ApiProperty({ example: true, description: 'Статус активности' })
  readonly isActive?: boolean;
}

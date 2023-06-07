import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.ru', description: 'почта' })
  readonly email: string;
  @ApiProperty({ example: 'ну тут букофки', description: 'Пароль' })
  readonly password: string;
  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  readonly fullName: string;
  @ApiProperty({ example: [], description: 'массив ролей' })
  readonly roles?: any[];
}

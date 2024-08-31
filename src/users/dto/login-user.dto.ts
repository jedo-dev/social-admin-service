import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'test@test.ru', description: 'Электронная почта' })
  readonly email: string;
  @ApiProperty({ example: '12345', description: 'Пароль' })
  readonly password: string; // Новое поле для пароля
}

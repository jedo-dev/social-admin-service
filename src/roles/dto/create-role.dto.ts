import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 1, description: 'id записи' })
  readonly id?: number;

  @ApiProperty({ example: 'Инженер', description: 'Текстовое название роли' })
  readonly name: string;
}

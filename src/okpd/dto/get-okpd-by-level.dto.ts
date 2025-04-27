import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetOkpdByLevelDto {
  @ApiProperty({
    description: 'Уровень записи',
    example: 2,
  })
  @IsNumber()
  level: number;

  @ApiProperty({
    description: 'Код родителя (опционально)',
    example: '01',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentCode?: string;
}

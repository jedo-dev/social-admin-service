import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('okpd')
export class Okpd extends BaseEntity {
  @ApiProperty({
    description: 'ID записи',
    example: 203,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Код ОКПД',
    example: '01.13.11',
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  code: string;

  @ApiProperty({
    description: 'Описание',
    example: 'Спаржа',
  })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Уровень в иерархии',
    example: 3,
  })
  @Column({ type: 'integer' })
  level: number;
}

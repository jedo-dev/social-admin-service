import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

//TODO: Остановился на связи many-to-many , 35:00 минута плюс-минус
@Entity()
export class User extends BaseEntity {
  @ApiProperty({ example: '1', description: 'уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ example: 'test@test.ru', description: 'почта' })
  @Column()
  email: string;
  @ApiProperty({ example: 'ну тут букофки', description: 'Пароль' })
  @Column()
  password: string;
  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @Column()
  firstName: string;
  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  @Column()
  lastName: string;
  @ApiProperty({ example: true, description: 'Статус активности' })
  @Column({ default: true })
  isActive: boolean;
}

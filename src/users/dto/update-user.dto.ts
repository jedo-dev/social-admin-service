// update-user.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from '../../roles/entities/role.entity';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  password?: string; // Новое поле для пароля

  @IsOptional()
  role?: Role;
}

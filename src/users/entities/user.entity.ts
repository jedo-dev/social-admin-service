import { Role } from 'src/roles/entities/role.entity';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  fullName: string;

  @ManyToMany(() => Role, (role) => role.users)
  roles?: Role[];
}

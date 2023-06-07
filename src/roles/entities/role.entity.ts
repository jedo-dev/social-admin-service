import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name?: string;
  @Column()
  code?: string;

  @ManyToMany((type) => User, (user) => user.roles)
  users?: User[];
}

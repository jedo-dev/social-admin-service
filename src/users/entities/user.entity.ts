import { Role } from 'src/roles/entities/role.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('social_users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  name: string;
  @Column()
  lastname: string;
  @Column()
  roleid: any;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'roleid', referencedColumnName: 'id' })
  role?: Role;
}

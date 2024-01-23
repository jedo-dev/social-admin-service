import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('social_roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name?: string;
  // @Column()
  // code?: string;

  // @OneToMany((type) => User, (user) => user.id)
  // users?: User[];
}

import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'egrul' })
export class EgrulEntity extends BaseEntity {
  @PrimaryColumn()
  inn: string;

  @Column({ name: 'has_disqualified_persons' })
  has_disqualified_persons: boolean;
}

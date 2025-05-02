import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'rnp' })
export class RnpEntity extends BaseEntity {
  @PrimaryColumn()
  inn: string;

  @Column()
  kpp: string;

  @Column()
  rnp_supplier_reg_number: string;

  @Column()
  include_reason: string;

  @Column()
  include_date: Date;

  @Column()
  exclude_date: Date;
}

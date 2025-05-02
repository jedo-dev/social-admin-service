import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'bo_balance' })
export class BoBalanceEntity extends BaseEntity {
  @PrimaryColumn({ name: 'inn', type: 'varchar' })
  inn: string;

  @Column({ name: 'financial_year' })
  financial_year: number;

  @Column({ name: 'str_code' })
  str_code: number;

  @Column({ name: 'str_value' })
  str_value: string;
}

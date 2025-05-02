import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'contract_main_info' })
export class ContractMainInfoEntity extends BaseEntity {
  @PrimaryColumn({ name: 'id_contract' })
  idContract: string;

  @Column({ name: 'supplier_inn', type: 'varchar'})
  supplierInn: string;

  @Column({ name: 'id_procedure', nullable: true })
  id_procedure: string;

  @Column({ name: 'customer_inn', nullable: true })
  customer_inn: string;

  @Column({ name: 'customer_kpp', nullable: true })
  customer_kpp: string;

  @Column({ name: 'protocol_date', nullable: true })
  protocol_date: string;

  @Column({ name: 'sign_date', nullable: true })
  sign_date: string;

  @Column({ name: 'min_publish_date', nullable: true })
  min_publish_date: string;

  @Column({ name: 'contract_subject', nullable: true })
  contract_subject: string;

  @Column({ name: 'contract_price_rub', nullable: true })
  contract_price_rub: string;

  @Column({ name: 'advance_sum_percents', nullable: true })
  advance_sum_percents: string;

  @Column({ name: 'subcontractor_sum_percents', nullable: true })
  subcontractor_sum_percents: string;

  @Column({ name: 'execution_start_date', nullable: true })
  execution_start_date: string;

  @Column({ name: 'execution_end_date', nullable: true })
  execution_end_date: string;

  @Column({ name: 'enforcement_type', nullable: true })
  enforcement_type: string;

  @Column({ name: 'enforcement_amount_rub', nullable: true })
  enforcement_amount_rub: string;

  @Column({ name: 'supplier_kpp', nullable: true })
  supplier_kpp: string;
}

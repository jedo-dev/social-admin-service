import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'fssp_enforcement_proceedings' })
export class FsspEntity extends BaseEntity {
  @PrimaryColumn({ name: 'enforcement_proceeding_number' })
  caseNumber: string;

  @Column({ name: 'debtor_inn', type: 'varchar', length: 12 })
  debtorInn: string;

  @Column({ name: 'amount_due', type: 'numeric' })
  amount: number;

  @Column({ name: 'enforcement_proceeding_date' })
  enforcementProceedingDate: Date;

  @Column({ name: 'enforcement_proceeding_subject' })
  enforcementProceedingSubject: string;
}

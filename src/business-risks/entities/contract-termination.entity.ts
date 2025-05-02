// entities/contract-termination.entity.ts
import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'contract_termination' })
export class ContractTerminationEntity extends BaseEntity {
  @PrimaryColumn({ name: 'id_contract' })
  idContract: string;

  @Column({ name: 't_termination_date', type: 'date' })
  terminationDate: Date;

  @Column({ name: 't_reason_info', nullable: true })
  reasonInfo: string;

  @Column({ name: 't_reason_name', nullable: true })
  reasonName: string;
}
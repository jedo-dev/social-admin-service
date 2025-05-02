import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'complaint_info' })
export class ComplaintEntity extends BaseEntity {
  @PrimaryColumn({ name: 'id_complaint' })
  id: string;

  @Column({ name: 'id_procedure' })
  id_procedure: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'processing_result' })
  result: string;
}

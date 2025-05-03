import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('inn')
export class InnList {
  @PrimaryColumn({ name: 'inn', type: 'varchar' })
  inn: string;
}

// entities/egrul-info.entity.ts
@Entity('egrul_info')
export class EgrulInfo {
  @PrimaryColumn({ name: 'inn', type: 'varchar' })
  inn: string;

  @Column({ name: 'kpp', type: 'varchar', nullable: true })
  kpp: string;

  @Column({ name: 'registration_date', type: 'date', nullable: true })
  registrationDate: Date;

  @Column({ name: 'entity_state', type: 'varchar', nullable: true })
  entityState: string;

  @Column({ name: 'okved_basic_code', type: 'varchar', nullable: true })
  okvedBasicCode: string;
}

// entities/msp-reestr.entity.ts
@Entity('msp_reestr')
export class MspReestr {
  @PrimaryColumn({ name: 'inn', type: 'varchar' })
  inn: string;

  @Column({ name: 'msp_category', type: 'integer', nullable: true })
  mspCategory: number;

  @Column({ name: 'msp_reestr_inclusion_date', type: 'date', nullable: true })
  inclusionDate: Date;
}

// entities/rnp.entity.ts
@Entity('rnp')
export class Rnp {
  @PrimaryColumn({ name: 'inn', type: 'varchar' })
  inn: string;

  @Column({ name: 'include_date', type: 'date', nullable: true })
  includeDate: Date;

  @Column({ name: 'include_reason', type: 'text', nullable: true })
  includeReason: string;
}
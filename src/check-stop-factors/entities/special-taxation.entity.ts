import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'special_taxation' })
export class SpecialTaxationEntity extends BaseEntity {
  @PrimaryColumn()
  inn: string;

  @Column()
  eshn_agricultural_tax: number;

  @Column()
  usn_simlified_tax_system: number;

  @Column()
  envd_imputed_tax: number;

  @Column()
  srp_product_sharing_agreement_tax: number;
}

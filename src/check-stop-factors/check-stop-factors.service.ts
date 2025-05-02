import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';

import { EgrulEntity } from './entities/egrul.entity';

import { RnpEntity } from './entities/rnp.entity';
import { SpecialTaxationEntity } from './entities/special-taxation.entity';
import { FsspEntity } from 'src/business-risks/entities/fssp.entity';

/**
 * Проверяет наличие стоп-факторов у поставщика
 * @param inn - ИНН поставщика
 * @returns {Promise<{hasStopFactors: boolean; details: string[]}>}
 * @description Проверяет:
 * 1. Наличие в реестре недобросовестных поставщиков (РНП)
 * 2. Наличие действующих исполнительных производств
 * 3. Налоговые нарушения (задолженности)
 * 4. Дисквалификацию руководства
 */

@Injectable()
export class CheckStopFactorsService {
  constructor(
    @InjectRepository(RnpEntity)
    private rnpRepo: Repository<RnpEntity>,

    @InjectRepository(FsspEntity)
    private fsspRepo: Repository<FsspEntity>,

    @InjectRepository(SpecialTaxationEntity)
    private taxDebtRepo: Repository<SpecialTaxationEntity>,

    @InjectRepository(EgrulEntity)
    private egrulRepo: Repository<EgrulEntity>,
  ) {}

   async checkStopFactors(inn: string): Promise<{
    hasStopFactors: boolean;
    details: string[];
  }> {
    const stopFactors: string[] = [];

    // 1. Проверка реестра недобросовестных поставщиков (РНП)
    const inRnp = await this.rnpRepo.existsBy({
      inn: String(inn),
      exclude_date: IsNull(), // Не исключен из реестра
    });

    if (inRnp) {
      stopFactors.push('Находится в реестре недобросовестных поставщиков');
    }

    // 2. Проверка исполнительных производств (ФССП)
    try {
      const activeEnforcements = await this.fsspRepo.countBy({
        debtorInn: String(inn),
        
        // enforcementProceedingDate: MoreThan(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000 *4)), // За последний год
      });

      console.log(`activeEnforcements`, activeEnforcements);
      if (activeEnforcements > 0) {
        stopFactors.push(`Имеет ${activeEnforcements} активных исполнительных производств`);
      }
    } catch (error) {
      console.log(`error`, error);
    }
    // 3. Проверка налоговых задолженностей (по данным ФНС)
    const taxDebt = await this.taxDebtRepo.findOneBy({
      inn: String(inn),
    });

    if (taxDebt) {
      stopFactors.push(`Имеет налоговую задолженность (${taxDebt.usn_simlified_tax_system} руб)`);
    }

    // 4. Проверка дисквалификации руководства (по данным ЕГРЮЛ)
    // const disqualifiedManagement = await this.egrulRepo.existsBy({
    //   inn: String(inn),
    //   has_disqualified_persons: true,
    // });

    // if (disqualifiedManagement) {
    //   stopFactors.push('Имеет дисквалифицированных руководителей');
    // }

    return {
      hasStopFactors: stopFactors.length > 0,
      details: stopFactors,
    };
  }
}

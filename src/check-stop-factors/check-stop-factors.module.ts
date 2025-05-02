import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckStopFactorsService } from './check-stop-factors.service';
import { EgrulEntity } from './entities/egrul.entity';

import { RnpEntity } from './entities/rnp.entity';
import { SpecialTaxationEntity } from './entities/special-taxation.entity';
import { FsspEntity } from 'src/business-risks/entities/fssp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RnpEntity, FsspEntity, SpecialTaxationEntity, EgrulEntity])],
  providers: [CheckStopFactorsService],
  exports: [CheckStopFactorsService],
})
export class CheckStopFactorsModule {}

// modules/business-risks/business-risks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessRisksService } from './business-risks.service';
import { ComplaintEntity } from './entities/complaint.entity';
import { ContractMainInfoEntity } from './entities/contract-main-info.entity';
import { ContractTerminationEntity } from './entities/contract-termination.entity';
import { FsspEntity } from './entities/fssp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractTerminationEntity,
      ContractMainInfoEntity,
      ComplaintEntity,
      FsspEntity,
    ]),
  ],
  providers: [BusinessRisksService],
  exports: [BusinessRisksService], // Важно для использования в других модулях
})
export class BusinessRisksModule {}

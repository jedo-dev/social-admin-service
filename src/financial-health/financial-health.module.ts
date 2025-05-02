// financial-health.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoBalanceEntity } from './entities/bo-balance.entity';
import { BoFinancialResultsEntity } from './entities/bo-financial-results.entity';
import { BoFundMovementEntity } from './entities/bo-fund-movement.entity';
import { FinancialHealthService } from './financial-health.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoBalanceEntity, BoFinancialResultsEntity, BoFundMovementEntity]),
  ],
  providers: [FinancialHealthService],
  exports: [FinancialHealthService],
})
export class FinancialHealthModule {}

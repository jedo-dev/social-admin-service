import { Module } from '@nestjs/common';
import { BusinessRisksModule } from 'src/business-risks/business-risks.module';
import { CheckStopFactorsModule } from 'src/check-stop-factors/check-stop-factors.module';
import { FinancialHealthModule } from 'src/financial-health/financial-health.module';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';

@Module({
  imports: [BusinessRisksModule, FinancialHealthModule, CheckStopFactorsModule], // Подключаем модуль бизнес-рисков
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}

// modules/rating/rating.service.ts
import { Injectable } from '@nestjs/common';
import { BusinessRisksService } from '../business-risks/business-risks.service';
import { FinancialHealthService } from '../financial-health/financial-health.service';
import { CheckStopFactorsService } from 'src/check-stop-factors/check-stop-factors.service';

@Injectable()
export class RatingService {
  constructor(
    private readonly businessRisksService: BusinessRisksService,
    private readonly financialHealthService: FinancialHealthService,
    private readonly checkStopFactorsService: CheckStopFactorsService,
  ) {}

  async calculateSupplierRating(inn: string) {
    // Параллельно загружаем все компоненты рейтинга
    const [businessRisks, financialHealth, stopFactors] = await Promise.all([
      this.businessRisksService.calculateBusinessRisks(inn),
      this.financialHealthService.calculate(inn),
      this.checkStopFactorsService.checkStopFactors(inn),
    ]);
    console.log(`stopFactors`, stopFactors);
    // Расчет общего рейтинга
    const totalRating = this.calculateTotalRating(businessRisks.score, financialHealth.score);

    return {
      totalRating,
      components: {
        businessRisks,
        financialHealth,
      },
      ratingDate: new Date().toISOString(),
    };
  }

  private calculateTotalRating(businessRisksScore: number, financialHealthScore: number): number {
    // Весовые коэффициенты (можно вынести в конфиг)
    const WEIGHTS = {
      businessRisks: 0.25,
      financialHealth: 0.35,
      stopFactors: 0.2,
      procurement: 0.15,
      growth: 0.05,
    };

    // Нормализация и расчет
    let rating =
      (100 - businessRisksScore) * WEIGHTS.businessRisks + // Инвертируем риски
      financialHealthScore * WEIGHTS.financialHealth;

    // Ограничение диапазона 0-100
    return Math.max(0, Math.min(rating, 100));
  }
}

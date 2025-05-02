// financial-health.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoBalanceEntity } from './entities/bo-balance.entity';
import { BoFinancialResultsEntity } from './entities/bo-financial-results.entity';
import { BoFundMovementEntity } from './entities/bo-fund-movement.entity';

@Injectable()
export class FinancialHealthService {
  // Коды строк баланса по российским стандартам
  private readonly BALANCE_CODES = {
    TOTAL_ASSETS: 1600, // Валюта баланса (актив)
    CURRENT_ASSETS: 1200, // Оборотные активы
    FIXED_ASSETS: 1100, // Внеоборотные активы
    CASH: 1250, // Денежные средства
    SHORT_TERM_DEBT: 1510, // Краткосрочные займы
    TOTAL_LIABILITIES: 1700, // Валюта баланса (пассив)
    EQUITY: 1300, // Собственный капитал
  };

  constructor(
    @InjectRepository(BoBalanceEntity)
    private balanceRepo: Repository<BoBalanceEntity>,

    @InjectRepository(BoFinancialResultsEntity)
    private financialResultsRepo: Repository<BoFinancialResultsEntity>,

    @InjectRepository(BoFundMovementEntity)
    private cashFlowRepo: Repository<BoFundMovementEntity>,
  ) {}

  async calculate(inn: string): Promise<{
    score: number;
    metrics: {
      currentRatio: number;
      quickRatio: number;
      absoluteLiquidity: number;
      profitability: number;
      debtToEquity: number;
      cashFlowCoverage: number;
    };
    interpretation: string;
  }> {

    const latestYear = await this.balanceRepo
    .createQueryBuilder('balance')
    .select('MAX(balance.financial_year)', 'max_year')
    .where('balance.inn = :inn', { inn: String(inn) })
    .getRawOne();
    const [balance, financialResults, cashFlow] = await Promise.all([
      this.getFullBalanceData(inn,latestYear),
      this.getLatestFinancialResults(inn,latestYear),
      this.getLatestCashFlow(inn,latestYear),
    ]);

    if (!balance || !financialResults) {
      // throw new Error('Financial data not found');
    }
    
    const metrics = this.calculateMetrics(balance, financialResults, cashFlow);
    const score = this.calculateScore(metrics);
    const interpretation = this.interpretResults(metrics);

    return {
      score,
      metrics,
      interpretation,
    };
  }

  /**
   * Получает все необходимые данные баланса за последний отчетный период
   */
  private async getFullBalanceData(inn: string, latestYear: any) {

    const records = await this.balanceRepo.query(
      'SELECT * FROM bo_balance WHERE inn = $1 and financial_year = $2',
      [inn, latestYear.max_year],
    );

    // Группируем данные
    const result = records.reduce(
      (acc, record) => {
        acc[record.str_code] = parseFloat(record.str_value) || 0;
        return acc;
      },
      {} as Record<number, number>,
    );

    
    return result;
  }

  /**
   * Получает отчет о финансовых результатах
   */
  private async getLatestFinancialResults(inn: string , latestYear: any) {
    const records = await this.financialResultsRepo.query(
      'SELECT * FROM bo_financial_results WHERE inn = $1 and financial_year = $2',
      [inn, latestYear.max_year],
    );

   
    if (!records.length) return null;

    // Группируем по кодам строк
    return records.reduce(
      (acc, record) => {
        acc[record.str_code] = parseFloat(record.str_value) || 0;
        return acc;
      },
      {} as Record<number, number>,
    );
  }

  /**
   * Получает отчет о движении денежных средств
   */
  private async getLatestCashFlow(inn: string, latestYear: any) {
    const records = await this.cashFlowRepo.query(
      'SELECT * FROM bo_fund_movement WHERE inn = $1 and financial_year = $2',
      [inn, latestYear.max_year],
    );

   
   
    if (!records.length) return null;

    // Группируем по кодам строк
    return records.reduce(
      (acc, record) => {
        acc[`str_code_${record.str_code}`] = parseFloat(record.str_value) || 0;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  /**
   * Рассчитывает все финансовые показатели
   */
  private calculateMetrics(
    balance: Record<number, number>,
    financialResults: Record<number, number>,
    cashFlow: Record<string, number>,
  ) {
    return {
      currentRatio: this.calculateCurrentRatio(balance),
      quickRatio: this.calculateQuickRatio(balance),
      absoluteLiquidity: this.calculateAbsoluteLiquidity(balance),
      profitability: this.calculateProfitability(financialResults),
      debtToEquity: this.calculateDebtToEquity(balance),
      cashFlowCoverage: this.calculateCashFlowCoverage(cashFlow, balance),
    };
  }

  /**
   * Коэффициент текущей ликвидности
   */
  private calculateCurrentRatio(balance: Record<number, number>): number {
    const currentAssets = balance[this.BALANCE_CODES.CURRENT_ASSETS];
    const currentLiabilities =
      balance[this.BALANCE_CODES.TOTAL_LIABILITIES] - balance[this.BALANCE_CODES.EQUITY];

    if (currentLiabilities <= 0) return 0;
    return currentAssets / currentLiabilities;
  }

  /**
   * Коэффициент быстрой ликвидности
   */
  private calculateQuickRatio(balance: Record<number, number>): number {
    const currentAssets = balance[this.BALANCE_CODES.CURRENT_ASSETS];
    const inventory = balance[1210] || 0; // Запасы
    const currentLiabilities =
      balance[this.BALANCE_CODES.TOTAL_LIABILITIES] - balance[this.BALANCE_CODES.EQUITY];

    if (currentLiabilities <= 0) return 0;
    return (currentAssets - inventory) / currentLiabilities;
  }

  /**
   * Коэффициент абсолютной ликвидности
   */
  private calculateAbsoluteLiquidity(balance: Record<number, number>): number {
    const cash = balance[this.BALANCE_CODES.CASH];
    const currentLiabilities =
      balance[this.BALANCE_CODES.TOTAL_LIABILITIES] - balance[this.BALANCE_CODES.EQUITY];
    
   
    if (currentLiabilities <= 0) return 0;
    return cash / currentLiabilities;
  }

  /**
   * Рентабельность продаж (ROS)
   */
  private calculateProfitability(financialResults: Record<number, number>): number {
    const revenue = financialResults?.[2110] || 0;
    const profit = financialResults?.[2400] || 0;

    return revenue !== 0 ? (profit / revenue) * 100 : 0;
  }

  /**
   * Соотношение долга к собственному капиталу
   */
  private calculateDebtToEquity(balance: Record<number, number>): number {
    const totalDebt =
      balance[this.BALANCE_CODES.TOTAL_LIABILITIES] - balance[this.BALANCE_CODES.EQUITY];
    const equity = balance[this.BALANCE_CODES.EQUITY];

    if (equity <= 0) return 100; // Если капитал отрицательный
    return (totalDebt / equity) * 100;
  }

  /**
   * Покрытие денежным потоком
   */
  private calculateCashFlowCoverage(
    cashFlow: Record<string, number>,
    balance: Record<number, number>,
  ): number {
    const operatingCashFlow = cashFlow?.['str_code_4110'] || 0;
    const totalDebt =
      balance[this.BALANCE_CODES.TOTAL_LIABILITIES] - balance[this.BALANCE_CODES.EQUITY];

    if (totalDebt <= 0) return 100;
    return (operatingCashFlow / totalDebt) * 100;
  }

  /**
   * Расчет общего балла финансового здоровья
   */
  private calculateScore(metrics: ReturnType<typeof this.calculateMetrics>): number {
    const weights = {
      currentRatio: 0.2,
      quickRatio: 0.2,
      absoluteLiquidity: 0.15,
      profitability: 0.25,
      debtToEquity: 0.1,
      cashFlowCoverage: 0.1,
    };

    // Нормализация показателей
    const normalized = {
      currentRatio: Math.min(metrics.currentRatio * 50, 100), // Преобразуем ~2.0 в 100
      quickRatio: Math.min(metrics.quickRatio * 100, 100),
      absoluteLiquidity: Math.min(metrics.absoluteLiquidity * 200, 100),
      profitability: metrics.profitability,
      debtToEquity: Math.max(0, 100 - metrics.debtToEquity), // Инвертируем
      cashFlowCoverage: Math.min(metrics.cashFlowCoverage, 100),
    };

    return Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + normalized[key] * weight;
    }, 0);
  }

  /**
   * Интерпретация результатов
   */
  private interpretResults(metrics: ReturnType<typeof this.calculateMetrics>): string {
    const interpretations = [];

    if (metrics.currentRatio < 1.5) {
      interpretations.push('Низкая текущая ликвидность');
    }

    if (metrics.debtToEquity > 70) {
      interpretations.push('Высокая долговая нагрузка');
    }

    if (metrics.profitability < 5) {
      interpretations.push('Низкая рентабельность');
    }

    return interpretations.length ? interpretations.join('. ') : 'Финансовое состояние стабильное';
  }
}

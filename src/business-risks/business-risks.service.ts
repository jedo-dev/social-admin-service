import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplaintEntity } from './entities/complaint.entity';
import { ContractMainInfoEntity } from './entities/contract-main-info.entity';
import { ContractTerminationEntity } from './entities/contract-termination.entity';
import { FsspEntity } from './entities/fssp.entity';

@Injectable()
export class BusinessRisksService {
  constructor(
    @InjectRepository(ContractTerminationEntity)
    private terminationRepo: Repository<ContractTerminationEntity>,

    @InjectRepository(ContractMainInfoEntity)
    private contractMainInfoRepo: Repository<ContractMainInfoEntity>,

    @InjectRepository(ComplaintEntity)
    private complaintRepo: Repository<ComplaintEntity>,

    @InjectRepository(FsspEntity)
    private fsspRepo: Repository<FsspEntity>,
  ) {}

  async calculateBusinessRisks(inn: string): Promise<{
    score: number;
    details: {
      terminations: number;
      complaints: number;
      enforcements: number;
    };
  }> {
   
    const [terminations, complaints, enforcements] = await Promise.all([
      this.getTerminationCount(inn.toString()),
      this.getComplaintCount(inn.toString()),
      this.getEnforcementCount(inn.toString()),
    ]).catch((error) => {
      console.error('Ошибка при расчете бизнес-рисков:', error);
      return [0, 0, 0];
    });
    const score = this.calculateRiskScore(terminations, complaints, enforcements);

    return {
      score,
      details: {
        terminations,
        complaints,
        enforcements,
      },
    };
  }
  /**
   * Подсчитывает количество фактов расторжения контрактов для указанного поставщика
   *
   * @param {string} inn - ИНН поставщика, для которого производится подсчет расторжений
   * @returns {Promise<number>} Количество расторжений контрактов, удовлетворяющих условиям:
   *
   * 1. Расторжение связано с контрактом из contract_main_info
   * 2. Контракт принадлежит поставщику с указанным ИНН (supplier_inn)
   *
   * @description Метод выполняет следующий алгоритм:
   * 1. Берет данные из таблицы расторжений (contract_termination)
   * 2. Соединяет с таблицей контрактов (contract_main_info) по полю id_contract
   * 3. Явно приводит числовой id_contract к текстовому виду для сравнения
   * 4. Фильтрует только те записи, где supplier_inn совпадает с переданным ИНН
   * 5. Возвращает общее количество уникальных расторжений
   *
   * @example
   * // Возвращает количество расторжений для поставщика с ИНН '7707049388'
   * const terminations = await getTerminationCount('7707049388');
   * console.log(`Поставщик расторгал контракты ${terminations} раз(а)`);
   *
   * @note Особенности работы:
   * - Использует CAST для сравнения разных типов id_contract (int4 ↔ text)
   * - Подсчитывает именно факты расторжений, а не количество контрактов
   * - Неявно применяет DISTINCT к id_contract при подсчете
   *
   * @throws {QueryFailedError} Может выбрасывать исключение при:
   * - Проблемах с приведением типов
   * - Отсутствии таблиц в БД
   * - Некорректном формате ИНН
   */
  private async getTerminationCount(inn: string): Promise<number> {
    return this.terminationRepo
      .createQueryBuilder('t')
      .innerJoin(
        ContractMainInfoEntity,
        'c',
        'c.id_contract = CAST(t.id_contract AS TEXT) AND c.supplier_inn = :inn',
        { inn },
      )
      .getCount();
  }

  /**
   * Подсчитывает количество жалоб, связанных с закупками указанного заказчика
   *
   * @param {string} inn - ИНН заказчика, для которого производится подсчет жалоб
   * @returns {Promise<number>} Количество жалоб, удовлетворяющих условиям:
   *
   * 1. Жалоба связана с процедурой закупки (по полю id_procedure)
   * 2. Эта процедура принадлежит заказчику с указанным ИНН (customer_inn)
   *
   * @description Метод выполняет следующий запрос:
   * 1. Берет данные из таблицы жалоб (complaint_info)
   * 2. Соединяет с таблицей уведомлений (notification_info) по полю id_procedure
   * 3. Фильтрует только те записи, где customer_inn совпадает с переданным ИНН
   * 4. Возвращает общее количество найденных жалоб
   *
   * @example
   * // Возвращает количество жалоб для заказчика с ИНН '7703363868'
   * const count = await getComplaintCount('7703363868');
   *
   * @throws {Error} Может выбрасывать исключение при проблемах с БД
   */
  private async getComplaintCount(inn: string): Promise<number> {
    return this.complaintRepo
      .createQueryBuilder('complaint')
      .innerJoin(
        'notification_info', // Прямое указание таблицы
        'notification',
        'notification.id_procedure = complaint.id_procedure',
      )
      .where('notification.customer_inn = :inn', { inn: String(inn) })
      .getCount();
  }
  /**
   * Подсчитывает количество исполнительных производств (долгов) для указанного ИНН
   *
   * @param {string} inn - ИНН юридического лица или ИП (должника)
   * @returns {Promise<number>} Количество действующих исполнительных производств:
   *
   * 1. Зарегистрированных в службе судебных приставов (ФССП)
   * 2. Где указанный ИНН числится должником
   *
   * @description Метод выполняет следующий алгоритм:
   * 1. Обращается к таблице исполнительных производств (fssp_enforcement_proceedings)
   * 2. Фильтрует записи по полю debtor_inn (ИНН должника)
   * 3. Возвращает общее количество найденных записей
   *
   * @example
   * // Возвращает количество исполнительных производств для ИНН '7707049388'
   * const enforcements = await getEnforcementCount('7707049388');
   * console.log(`Количество долговых производств: ${enforcements}`);
   *
   * @note Особенности работы:
   * - Учитывает все производства, где ИНН указан как должник
   * - Автоматически приводит ИНН к строковому типу для сравнения
   * - Не учитывает сумму или статус производства (только факт наличия)
   *
   * @throws {QueryFailedError} Может выбрасывать исключение при:
   * - Отсутствии таблицы в БД
   * - Некорректном формате ИНН
   * - Проблемах подключения к БД
   */
  private async getEnforcementCount(inn: string): Promise<number> {
    return this.fsspRepo.count({ where: { debtorInn: String(inn) } });
  }

  private calculateRiskScore(
    terminations: number,
    complaints: number,
    enforcements: number,
  ): number {
    const WEIGHTS = {
      terminations: 0.4,
      complaints: 0.3,
      enforcements: 0.3,
    };

    const MAX_VALUES = {
      terminations: 5,
      complaints: 3,
      enforcements: 2,
    };

    const normalized = {
      terminations: Math.min(terminations / MAX_VALUES.terminations, 1),
      complaints: Math.min(complaints / MAX_VALUES.complaints, 1),
      enforcements: Math.min(enforcements / MAX_VALUES.enforcements, 1),
    };

    const totalRisk =
      normalized.terminations * WEIGHTS.terminations +
      normalized.complaints * WEIGHTS.complaints +
      normalized.enforcements * WEIGHTS.enforcements;

    return 10 - Math.min(totalRisk * 10, 10);
  }
}

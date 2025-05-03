// participant.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { InnList } from './entities/inn-list.entity';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(InnList)
    private readonly innRepository: Repository<InnList>,
  ) {}

  async getParticipants(pagination: PaginationDto) {
    const { page = 1, limit = 10, search, okved } = pagination;
    const skip = (page - 1) * limit;
    console.log(okved);
    try {
      // Базовый запрос с определением типа участника
      let baseQuery = `
        SELECT 
          i.inn,
          e.entity_state as status,
          e.okved_basic_code as main_okved,
          e.registration_date,
          m.msp_category,
          s.oktmo_reg_name as region,
          CASE WHEN r.inn IS NOT NULL THEN true ELSE false END as in_rnp,
          (
            SELECT COUNT(*) 
            FROM contract_main_info c 
            WHERE c.supplier_inn = i.inn
          ) as contracts_as_supplier_count,
          (
            SELECT COUNT(*) 
            FROM contract_main_info c 
            WHERE c.customer_inn = i.inn
          ) as contracts_as_customer_count,
          CASE
            WHEN EXISTS (SELECT 1 FROM contract_main_info WHERE supplier_inn = i.inn) AND
                 EXISTS (SELECT 1 FROM contract_main_info WHERE customer_inn = i.inn) 
            THEN 'supplier_and_customer'
            WHEN EXISTS (SELECT 1 FROM contract_main_info WHERE supplier_inn = i.inn) 
            THEN 'supplier'
            WHEN EXISTS (SELECT 1 FROM contract_main_info WHERE customer_inn = i.inn) 
            THEN 'customer'
            ELSE 'unknown'
          END as participant_type
        FROM inn i
        LEFT JOIN egrul_info e ON e.inn = i.inn
        LEFT JOIN msp_reestr m ON m.inn = i.inn
        LEFT JOIN rnp r ON r.inn = i.inn
        LEFT JOIN statistic_codes s ON s.inn = i.inn
      `;

      // Условия поиска
      let whereClause = '';
      const conditions = [];

      if (search) {
        conditions.push(`(i.inn LIKE '%${search}%' OR s.oktmo_reg_name LIKE '%${search}%')`);
      }

      if (okved) {
        conditions.push(`e.okved_basic_code LIKE '%${okved}%'`);
      }

      if (conditions.length > 0) {
        whereClause = `WHERE ${conditions.join(' AND ')}`;
      }

      // Основной запрос с пагинацией
      const query = `
        ${baseQuery}
        ${whereClause}
        ORDER BY i.inn
        LIMIT ${limit} OFFSET ${skip}
      `;

      // Запрос для подсчета общего количества
      const countQuery = `
        SELECT COUNT(*) as count
        FROM (${baseQuery} ${whereClause}) AS count_query
      `;

      const [data, totalResult] = await Promise.all([
        this.innRepository.query(query),
        this.innRepository.query(countQuery),
      ]);

      return {
        data,
        total: parseInt(totalResult[0]?.count || 0),
        page,
        limit,
      };
    } catch (error) {
      console.error('Error fetching participants:', error);
      throw new Error('Failed to fetch participants');
    }
  }
  async getParticipantDetails(inn: string) {
    console.log(inn);
    try {
      const query = `
    WITH 
    supplier_stats AS (
      SELECT 
        supplier_inn as inn,
        COUNT(*) as contracts_count
      FROM contract_main_info
      WHERE supplier_inn = $1
      GROUP BY supplier_inn
    ),

    customer_stats AS (
      SELECT 
        customer_inn as inn,
        COUNT(*) as contracts_count
      FROM contract_main_info
      WHERE customer_inn = $1
      GROUP BY customer_inn
    ),

    fz44 AS (
      SELECT 
        participant_inn as inn,
        SUM(CASE WHEN fz = '44fz' THEN procedure_qty::integer ELSE 0 END) as participated_44fz,
        SUM(CASE WHEN fz = '44fz' THEN win_qty::integer ELSE 0 END) as wins_44fz
      FROM participation_statistic
      WHERE participant_inn = $1
      GROUP BY participant_inn
    ),

    fz223 AS (
      SELECT 
        participant_inn as inn,
        SUM(CASE WHEN fz = '223fz' THEN procedure_qty::integer ELSE 0 END) as participated_223fz,
        SUM(CASE WHEN fz = '223fz' THEN win_qty::integer ELSE 0 END) as wins_223fz
      FROM participation_statistic
      WHERE participant_inn = $1
      GROUP BY participant_inn
    ),

    supplier_yearly AS (
      SELECT
        EXTRACT(YEAR FROM TO_DATE(sign_date, 'DD.MM.YYYY')) as year,
        COUNT(*) as contract_count,
        SUM(REPLACE(contract_price_rub, ',', '.')::numeric) as contract_sum
      FROM contract_main_info
      WHERE supplier_inn = $1
      GROUP BY EXTRACT(YEAR FROM TO_DATE(sign_date, 'DD.MM.YYYY'))
    ),

    customer_yearly AS (
      SELECT
        EXTRACT(YEAR FROM TO_DATE(sign_date, 'DD.MM.YYYY')) as year,
        COUNT(*) as contract_count,
        SUM(REPLACE(contract_price_rub, ',', '.')::numeric) as contract_sum
      FROM contract_main_info
      WHERE customer_inn = $1
      GROUP BY EXTRACT(YEAR FROM TO_DATE(sign_date, 'DD.MM.YYYY'))
    ),

    yearly_combined AS (
      SELECT
        year,
        SUM(contract_count) as total_contracts,
        SUM(contract_sum) as total_sum
      FROM (
        SELECT * FROM supplier_yearly
        UNION ALL
        SELECT * FROM customer_yearly
      ) combined
      GROUP BY year
    )

    SELECT 
      i.inn,
      e.entity_state as status,
      e.okved_basic_code as main_okved,
      e.registration_date,
      m.msp_category,
      s.oktmo_reg_name as region,
      CASE WHEN r.inn IS NOT NULL THEN true ELSE false END as in_rnp,
      
      COALESCE(ss.contracts_count, 0) as contracts_as_supplier_count,
      COALESCE(cs.contracts_count, 0) as contracts_as_customer_count,
      
      COALESCE(f44.participated_44fz, 0) as participated_44fz,
      COALESCE(f44.wins_44fz, 0) as wins_44fz,
      
      COALESCE(f223.participated_223fz, 0) as participated_223fz,
      COALESCE(f223.wins_223fz, 0) as wins_223fz,
      
      CASE
        WHEN COALESCE(ss.contracts_count, 0) > 0 AND COALESCE(cs.contracts_count, 0) > 0 
        THEN 'supplier_and_customer'
        WHEN COALESCE(ss.contracts_count, 0) > 0 THEN 'supplier'
        WHEN COALESCE(cs.contracts_count, 0) > 0 THEN 'customer'
        ELSE 'unknown'
      END as participant_type,
      
      CASE WHEN COALESCE(f44.participated_44fz, 0) > 0 
        THEN ROUND(COALESCE(f44.wins_44fz, 0) * 100.0 / f44.participated_44fz, 2)
        ELSE 0 END as win_rate_44fz,
      
      CASE WHEN COALESCE(f223.participated_223fz, 0) > 0 
        THEN ROUND(COALESCE(f223.wins_223fz, 0) * 100.0 / f223.participated_223fz, 2)
        ELSE 0 END as win_rate_223fz,
      
      (
        SELECT json_agg(json_build_object(
          'year', year,
          'total_contracts', total_contracts,
          'total_sum', total_sum
        ))
        FROM yearly_combined
      ) as yearly_activity

    FROM inn i
    LEFT JOIN egrul_info e ON e.inn = i.inn
    LEFT JOIN msp_reestr m ON m.inn = i.inn
    LEFT JOIN rnp r ON r.inn = i.inn
    LEFT JOIN statistic_codes s ON s.inn = i.inn
    LEFT JOIN supplier_stats ss ON ss.inn = i.inn
    LEFT JOIN customer_stats cs ON cs.inn = i.inn
    LEFT JOIN fz44 f44 ON f44.inn = i.inn
    LEFT JOIN fz223 f223 ON f223.inn = i.inn
    WHERE i.inn = $1
  `;

      const result = await this.innRepository.query(query, [inn]);
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching participant details:', error);
      throw new Error('Failed to fetch participant details');
    }
  }
}

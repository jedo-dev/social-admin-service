// participant.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InnList } from './entities/inn-list.entity';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(InnList)
    private readonly innRepository: Repository<InnList>,
  ) {}

  async getParticipants(pagination: PaginationDto) {
    const { page = 1, limit = 10, search } = pagination;
    const skip = (page - 1) * limit;

    try {
      // Упрощенный базовый запрос только с ключевой информацией
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
          ) as contracts_count,
          (
            SELECT SUM(c.contract_price_rub::numeric)
            FROM contract_main_info c
            WHERE c.supplier_inn = i.inn
          ) as total_contracts_sum
        FROM inn i
        LEFT JOIN egrul_info e ON e.inn = i.inn
        LEFT JOIN msp_reestr m ON m.inn = i.inn
        LEFT JOIN rnp r ON r.inn = i.inn
        LEFT JOIN statistic_codes s ON s.inn = i.inn
      `;

      // Условия поиска
      let whereClause = '';
      if (search) {
        whereClause = `
          WHERE 
            i.inn LIKE '%${search}%' OR 
            e.okved_basic_code LIKE '%${search}%' OR
            s.oktmo_reg_name LIKE '%${search}%'
        `;
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

}
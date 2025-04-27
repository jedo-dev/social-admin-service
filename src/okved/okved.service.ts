import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Okved } from './entities/okved.entity';
import { GetOkvedByLevelDto } from './dto/get-okved-by-level.dto';


@Injectable()
export class OkvedService {
  constructor(
    @InjectRepository(Okved)
    private okvedRepository: Repository<Okved>,
  ) {}

  async findOne(id: number): Promise<Okved> {
    return this.okvedRepository.findOne({ where: { id } });
  }

  async findByLevel(dto: GetOkvedByLevelDto): Promise<Okved[]> {
    const query = this.okvedRepository
      .createQueryBuilder('okved')
      .where('okved.level = :level', { level: dto.level });

    if (dto.parentCode) {
      query.andWhere('okved.code LIKE :parentCode', {
        parentCode: `${dto.parentCode}%`,
      });
    }

    return query.orderBy('okved.code', 'ASC').getMany();
  }
}

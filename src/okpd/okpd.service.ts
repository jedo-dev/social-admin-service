import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOkpdByLevelDto } from './dto/get-okpd-by-level.dto';
import { Okpd } from './entities/okpd.entity';

@Injectable()
export class OkpdService {
  constructor(
    @InjectRepository(Okpd)
    private okpdRepository: Repository<Okpd>,
  ) {}

  async findOne(id: number): Promise<Okpd> {
    return this.okpdRepository.findOne({ where: { id } });
  }

  async findByLevel(dto: GetOkpdByLevelDto): Promise<Okpd[]> {
    const query = this.okpdRepository
      .createQueryBuilder('okpd')
      .where('okpd.level = :level', { level: dto.level });

    if (dto.parentCode) {
      query.andWhere('okpd.code LIKE :parentCode', {
        parentCode: `${dto.parentCode}%`,
      });
    }

    return query.orderBy('okpd.code', 'ASC').getMany();
  }
}

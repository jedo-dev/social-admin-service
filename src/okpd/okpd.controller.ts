import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetOkpdByLevelDto } from './dto/get-okpd-by-level.dto';
import { Okpd } from './entities/okpd.entity';
import { OkpdService } from './okpd.service';

@ApiTags('okpd')
@Controller('okpd')
export class OkpdController {
  constructor(private readonly okpdService: OkpdService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получить запись ОКПД по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID записи ОКПД',
    example: 203,
  })
  @ApiResponse({
    status: 200,
    description: 'Запись ОКПД успешно найдена',
    type: Okpd,
  })
  @ApiResponse({
    status: 404,
    description: 'Запись ОКПД не найдена',
  })
  async findOne(@Param('id') id: string): Promise<Okpd> {
    return this.okpdService.findOne(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить записи ОКПД по уровню и коду родителя' })
  @ApiQuery({
    name: 'level',
    description: 'Уровень записи',
    example: 2,
  })
  @ApiQuery({
    name: 'parentCode',
    description: 'Код родителя (опционально)',
    example: '01',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Список записей ОКПД',
    type: [Okpd],
  })
  async findByLevel(@Query() dto: GetOkpdByLevelDto): Promise<Okpd[]> {
    return this.okpdService.findByLevel(dto);
  }
}

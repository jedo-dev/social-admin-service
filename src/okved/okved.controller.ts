import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetOkvedByLevelDto } from './dto/get-okved-by-level.dto';
import { Okved } from './entities/okved.entity';
import { OkvedService } from './okved.service';

@ApiTags('okved')
@Controller('okved')
export class OkvedController {
  constructor(private readonly OkvedService: OkvedService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получить запись ОКВЕД по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID записи ОКВЕД',
    example: 203,
  })
  @ApiResponse({
    status: 200,
    description: 'Запись ОКВЕД успешно найдена',
    type: Okved,
  })
  @ApiResponse({
    status: 404,
    description: 'Запись ОКВЕД не найдена',
  })
  async findOne(@Param('id') id: string): Promise<Okved> {
    return this.OkvedService.findOne(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить записи ОКВЕД по уровню и коду родителя' })
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
    description: 'Список записей ОКВЕД',
    type: [Okved],
  })
  async findByLevel(@Query() dto: GetOkvedByLevelDto): Promise<Okved[]> {
    return this.OkvedService.findByLevel(dto);
  }
}

// controllers/participant.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';

import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';
import { ParticipantService } from './participant.service';

@ApiTags('Participants')
@Controller('participants')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'okved', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Paginated participants list' })
  async getParticipants(@Query() pagination: PaginationDto) {
    return this.participantService.getParticipants(pagination);
  }

  @Get(':inn')
  @ApiParam({ name: 'inn', description: 'ИНН участника' })
  @ApiResponse({ status: 200, description: 'Детальная информация об участнике' })
  @ApiResponse({ status: 404, description: 'Участник не найден' })
  async getParticipantDetails(@Param('inn') inn: string) {
    return this.participantService.getParticipantDetails(inn);
  }
}

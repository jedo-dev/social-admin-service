// controllers/participant.controller.ts
import { Controller, Get, Query } from '@nestjs/common';

import { PaginationDto } from './dto/pagination.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParticipantService } from './participant.service';

@ApiTags('Participants')
@Controller('participants')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Paginated participants list' })
  async getParticipants(@Query() pagination: PaginationDto) {
    return this.participantService.getParticipants(pagination);
  }
}
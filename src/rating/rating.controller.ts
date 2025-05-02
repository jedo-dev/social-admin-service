// modules/rating/rating.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('supplier/:inn')
  async getSupplierRating(@Param('inn') inn: string) {
    return this.ratingService.calculateSupplierRating(inn);
  }
}
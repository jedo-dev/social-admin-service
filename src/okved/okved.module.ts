import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OkvedController } from './okved.controller';

import { Okved } from './entities/okved.entity';
import { OkvedService } from './okved.service';

@Module({
  imports: [TypeOrmModule.forFeature([Okved])],
  controllers: [OkvedController],
  providers: [OkvedService],
  exports: [OkvedService],
})
export class OkvedModule {}

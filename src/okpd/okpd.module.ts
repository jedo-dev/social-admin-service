import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Okpd } from './entities/okpd.entity';
import { OkpdController } from './okpd.controller';
import { OkpdService } from './okpd.service';

@Module({
  imports: [TypeOrmModule.forFeature([Okpd])],
  controllers: [OkpdController],
  providers: [OkpdService],
  exports: [OkpdService],
})
export class OkpdModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EgrulInfo, InnList, MspReestr, Rnp } from './entities/inn-list.entity';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';

@Module({
  imports: [TypeOrmModule.forFeature([InnList, MspReestr, Rnp, EgrulInfo])],
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}

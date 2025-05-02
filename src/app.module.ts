import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { BusinessRisksModule } from './business-risks/business-risks.module';
import { ComplaintEntity } from './business-risks/entities/complaint.entity';
import { ContractMainInfoEntity } from './business-risks/entities/contract-main-info.entity';
import { ContractTerminationEntity } from './business-risks/entities/contract-termination.entity';
import { FsspEntity } from './business-risks/entities/fssp.entity';
import { EgrulEntity } from './check-stop-factors/entities/egrul.entity';
import { RnpEntity } from './check-stop-factors/entities/rnp.entity';
import { SpecialTaxationEntity } from './check-stop-factors/entities/special-taxation.entity';
import { BoBalanceEntity } from './financial-health/entities/bo-balance.entity';
import { BoFinancialResultsEntity } from './financial-health/entities/bo-financial-results.entity';
import { BoFundMovementEntity } from './financial-health/entities/bo-fund-movement.entity';
import { Okpd } from './okpd/entities/okpd.entity';
import { OkpdModule } from './okpd/okpd.module';
import { Okved } from './okved/entities/okved.entity';
import { OkvedModule } from './okved/okved.module';
import { RatingModule } from './rating/rating.module';
import { Role } from './roles/entities/role.entity';
import { RolesModule } from './roles/roles.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD.toString(),
      database: process.env.POSTGRES_DB,
      entities: [
        User,
        Role,
        Okpd,
        Okved,
        ContractTerminationEntity,
        ContractMainInfoEntity,
        ComplaintEntity,
        FsspEntity,
        BoBalanceEntity,
        BoFinancialResultsEntity,
        BoFundMovementEntity,
        RnpEntity,
        FsspEntity,
        SpecialTaxationEntity,
        EgrulEntity,
      ],
    }),
    UsersModule,
    RolesModule,
    OkpdModule,
    OkvedModule,
    BusinessRisksModule,
    RatingModule,
  ],
  providers: [
    {
      provide: 'postgresDataSource',
      useFactory: (dataSource: DataSource) => dataSource,
      inject: [DataSource],
    },
    JwtService,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(PasswordHideMiddleware).forRoutes('users');
  // }
}

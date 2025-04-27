import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { Okpd } from './okpd/entities/okpd.entity';
import { OkpdModule } from './okpd/okpd.module';
import { Okved } from './okved/entities/okved.entity';
import { OkvedModule } from './okved/okved.module';
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
      entities: [User, Role, Okpd, Okved],
    }),
    UsersModule,
    RolesModule,
    OkpdModule,
    OkvedModule,
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

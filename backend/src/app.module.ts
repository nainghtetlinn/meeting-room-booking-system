import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from './bookings/bookings.module';
import { AppConfig } from './config';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Booking } from './bookings/entities/booking.entity';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    TypeOrmModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => {
        return {
          type: 'postgres',
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.database,
          entities: [User, Booking],
          synchronize: true,
        };
      },
    }),
    UsersModule,
    BookingsModule,
  ],
})
export class AppModule {}

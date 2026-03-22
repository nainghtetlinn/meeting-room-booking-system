import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from './ability/ability.module';
import { BookingsModule } from './bookings/bookings.module';
import { Booking } from './bookings/entities/booking.entity';
import { AppConfig } from './config';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => {
        return {
          type: 'postgres',
          url: config.database_url,
          entities: [User, Booking],
          synchronize: true,
        };
      },
    }),
    ConfigifyModule.forRootAsync(),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    BookingsModule,
    AbilityModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

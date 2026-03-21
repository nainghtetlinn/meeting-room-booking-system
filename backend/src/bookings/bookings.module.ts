import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from 'src/ability/ability.module';
import { UsersModule } from 'src/users/users.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), UsersModule, AbilityModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}

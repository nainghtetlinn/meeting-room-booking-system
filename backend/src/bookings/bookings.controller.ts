import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Create booking' })
  @Post()
  create(@GetUser() user: User, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto, user);
  }

  @ApiOperation({ summary: 'View all bookings' })
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @ApiOperation({ summary: 'View bookings grouped by user' })
  @Get('/grouped')
  grouped(@GetUser() user: User) {
    return this.bookingsService.findBookingsGroupedByUser(user);
  }

  @ApiOperation({ summary: 'View basic usage summary' })
  @Get('/summary')
  summary(@GetUser() user: User) {
    return this.bookingsService.getUsageSummary(user);
  }

  @ApiOperation({ summary: 'Delete booking' })
  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: number) {
    return this.bookingsService.remove(id, user);
  }
}

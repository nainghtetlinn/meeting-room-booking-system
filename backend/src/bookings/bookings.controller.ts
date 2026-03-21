import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Create booking' })
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(5, createBookingDto);
  }

  @ApiOperation({ summary: 'View all bookings' })
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @ApiOperation({ summary: 'View bookings grouped by user' })
  @Get('/user/:id')
  findBookingsByUserId(@Param('id') id: number) {
    return this.bookingsService.findAllByUserId(id);
  }

  @ApiOperation({ summary: 'View basic usage summary' })
  @Get('/summary')
  summary() {
    return this.bookingsService.getUsageSummary();
  }

  @ApiOperation({ summary: 'Delete booking' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookingsService.remove(id);
  }
}

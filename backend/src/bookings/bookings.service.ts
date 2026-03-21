import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, createBookingDto: CreateBookingDto) {
    const { startTime, endTime } = createBookingDto;

    if (startTime >= endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const overlappingBooking = await this.bookingRepo.findOne({
      where: {
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (overlappingBooking) {
      throw new ConflictException(
        'This time slot overlaps with an existing booking.',
      );
    }

    return this.bookingRepo.save({
      userId,
      ...createBookingDto,
    });
  }

  findAll() {
    return this.bookingRepo.find();
  }

  async findAllByUserId(userId: number) {
    const user = await this.usersService.findById(userId);
    return this.bookingRepo.find({
      where: {
        userId: user.id,
      },
    });
  }

  async remove(id: number) {
    const booking = await this.findById(id);
    return this.bookingRepo.remove(booking);
  }

  async getUsageSummary() {
    const bookings = await this.bookingRepo.find({
      relations: ['user'], // Join the user data
      order: {
        userId: 'ASC',
        startTime: 'DESC',
      },
    });

    // Transform the flat list into a grouped object
    return bookings.reduce((acc, booking) => {
      const userName = booking.user.name;
      if (!acc[userName]) acc[userName] = [];
      acc[userName].push(booking);
      return acc;
    }, {});
  }

  async findById(id: number) {
    const booking = await this.bookingRepo.findOneBy({
      id,
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}

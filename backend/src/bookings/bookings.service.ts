import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { User } from 'src/users/entities/user.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private abilityFactory: AbilityFactory,
  ) { }

  async create(createBookingDto: CreateBookingDto, currentUser: User) {
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
      userId: currentUser.id,
      ...createBookingDto,
    });
  }

  findAll() {
    return this.bookingRepo.find({
      relations: {
        user: true
      }
    });
  }

  async findBookingsGroupedByUser(currentUser: User) {
    this.abilityFactory.checkPermission(
      currentUser,
      Action.ReadSummary,
      Booking,
    );
    return await this.userRepo.find({
      relations: {
        bookings: true,
      },
      order: {
        name: 'ASC',
        bookings: {
          startTime: 'DESC',
        },
      },
    });
  }

  async getUsageSummary(currentUser: User) {
    this.abilityFactory.checkPermission(
      currentUser,
      Action.ReadSummary,
      Booking,
    );
    return await this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoin('booking.user', 'user')
      .select([
        'user.id AS "userId"',
        'user.name AS "userName"',
        'COUNT(booking.id) AS "totalBookings"',
      ])
      .groupBy('user.id')
      .addGroupBy('user.name')
      .orderBy('"totalBookings"', 'DESC')
      .getRawMany();
  }

  async remove(id: number, currentUser: User) {
    const booking = await this.findById(id);
    this.abilityFactory.checkPermission(currentUser, Action.Delete, booking);
    return this.bookingRepo.remove(booking);
  }

  async findById(id: number) {
    const booking = await this.bookingRepo.findOneBy({
      id,
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
